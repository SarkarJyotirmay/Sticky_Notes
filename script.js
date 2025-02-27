/*
Working Logic : 
Each time user creates a note every data fits in an object then the object pushes into the created Array.
We call a function, displayNotes to fetch every object creates a note from the object dinamically then display 
every note on browser.
*/

const createdNotes = [];
const deletedNotes = [];

const textarea = document.querySelector("textarea");
// const createButton = document.querySelector("button");
const form = document.querySelector("form");
const color = document.querySelector("input");
const fragment = document.createDocumentFragment();
let notesContainer = document.querySelector(".note-container");
const undoButton = document.querySelector(".undo-button");

// While DOM refreshes check the need of UNDO button and revove functionality if not needed
if (deletedNotes.length === 0) {
  undoButton.disabled = true;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  // creating a object for every note tobe created containing every data of the note
  const newNote = {
    text: textarea.value,
    color: color.value,
    timeStamp: new Date().toLocaleString(),
    position: Date.now(),
  };

  createdNotes.push(newNote);
  displayNotes();

  textarea.value = "";
  textarea.focus();
});

function displayNotes() {
  notesContainer.innerHTML = "";
  const fragment = document.createDocumentFragment();

  createdNotes.forEach((note) => {
    const noteDiv = document.createElement("div");
    noteDiv.classList.add("note");

    const text = document.createElement("p");
    text.classList.add("text");
    text.textContent = note.text;

    noteDiv.style.backgroundColor = note.color;

    const timeStamp = document.createElement("span");
    timeStamp.classList.add("time-stamp");
    timeStamp.innerText = note.timeStamp;
    //! Close button 
// When a note gets deletd, splice the note object from the created array push the object to deleted array.
    const close = document.createElement("span");
    close.classList.add("fa-solid", "fa-xmark", "close");
    close.addEventListener("click", (e) => {
      undoButton.disabled = false;
      const toDeleteNoteIndex = createdNotes.findIndex((n) => {
        return n.position === note.position;
      });
      deletedNotes.push(...createdNotes.splice(toDeleteNoteIndex, 1));
      displayNotes();
    });

    //! Edit Button
    // Edit button will be there but the textarea to take the editing input will have display none by default. After first click it will be visible and p tag (text) will be hidden. Then values will be taken and fetch and database(object) will be updated (*Note: we are in a for each loop so not object will be accessable automatically.)
    const edit = document.createElement("span");
    edit.classList.add("edit", "fa-solid", "fa-pen-to-square");

    let editableInput = document.createElement("textarea");
    editableInput.value = note.text;

    editableInput.style.display = "none";

    noteDiv.append(editableInput);

    edit.addEventListener("click", (e) => {
      if (editableInput.style.display === "none") {
        editableInput.style.display = "block";
        editableInput.focus();
        text.style.display = "none";
      } else {
        console.log(note);
        note.text = editableInput.value;
        text.innerText = editableInput.value;
        editableInput.style.display = "none";
        text.style.display = "block";
      }
    });
// appending note to fragment
    noteDiv.append(text, timeStamp, close, edit);
    fragment.append(noteDiv);
  });

  notesContainer.append(fragment);
}

undoButton.addEventListener("click", (e) => {
  if (deletedNotes.length > 0) {
    const lastDeleted = deletedNotes.pop();
    createdNotes.push(lastDeleted);
    createdNotes.sort((a, b) => {
      return a.position - b.position;
    });
  }
  displayNotes();
});
