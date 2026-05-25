// DOM Elements
const openFormBtn = document.getElementById('openFormBtn');
const closeFormBtn = document.getElementById('closeFormBtn');
const sideForm = document.getElementById('sideForm');

const noteTitle = document.getElementById('noteTitle');
const noteContent = document.getElementById('noteContent');
const noteFile = document.getElementById('noteFile');
const addNoteBtn = document.getElementById('addNoteBtn');

const notesContainer = document.getElementById('notesContainer');

// Load notes from localStorage
let notes = JSON.parse(localStorage.getItem('teacherNotes')) || [];

// Display notes
function displayNotes() {
    notesContainer.innerHTML = '';
    if(notes.length === 0){
        notesContainer.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#888;">No notes added yet.</p>';
        return;
    }

    notes.forEach((note,index)=>{
        const noteCard = document.createElement('div');
        noteCard.classList.add('note-card');

        let fileHTML = '';
        if(note.file){
            if(note.fileType === 'image'){
                fileHTML = `<img src="${note.file}" alt="Note Image">`;
            } else if(note.fileType === 'pdf'){
                fileHTML = `<a href="${note.file}" target="_blank">📄 View PDF</a>`;
            }
        }

        noteCard.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            ${fileHTML}
            <button class="delete-btn" onclick="deleteNote(${index})">Delete</button>
        `;
        notesContainer.appendChild(noteCard);
    });
}

// Open / Close form
openFormBtn.addEventListener('click', ()=> sideForm.classList.add('active'));
closeFormBtn.addEventListener('click', ()=> sideForm.classList.remove('active'));

// Add Note
addNoteBtn.addEventListener('click', ()=>{
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();

    if(!title || !content){
        alert('Please enter both title and content!');
        return;
    }

    if(noteFile.files.length > 0){
        const file = noteFile.files[0];
        const reader = new FileReader();
        reader.onload = function(e){
            const fileType = file.type.startsWith('image') ? 'image' : 'pdf';
            notes.push({title, content, file: e.target.result, fileType});
            localStorage.setItem('teacherNotes', JSON.stringify(notes));
            resetForm();
            displayNotes();
        }
        reader.readAsDataURL(file);
    } else {
        notes.push({title, content, file:null, fileType:null});
        localStorage.setItem('teacherNotes', JSON.stringify(notes));
        resetForm();
        displayNotes();
    }
});

// Delete Note
function deleteNote(index){
    notes.splice(index,1);
    localStorage.setItem('teacherNotes', JSON.stringify(notes));
    displayNotes();
}

// Reset Form
function resetForm(){
    noteTitle.value = '';
    noteContent.value = '';
    noteFile.value = '';
    sideForm.classList.remove('active');
}

// Initial display
displayNotes();

function createNote() {
    const title = document.getElementById('noteTitle').value;
    const content = document.getElementById('noteContent').value;
    const files = document.getElementById('noteFile').files;

    if(!title && !content && files.length === 0){
        alert("Please add some content or files!");
        return;
    }

    // Create note div
    let noteDiv = document.createElement('div');
    noteDiv.className = 'note';

    if(title) {
        let h3 = document.createElement('h3');
        h3.textContent = title;
        noteDiv.appendChild(h3);
    }

    if(content) {
        let p = document.createElement('p');
        p.textContent = content;
        noteDiv.appendChild(p);
    }

    if(files.length > 0) {
        for(let i=0; i<files.length; i++) {
            let file = files[i];

            // Create container for file
            let fileContainer = document.createElement('div');
            fileContainer.className = 'file-container';

            // Create a link for viewing and downloading
            let link = document.createElement('a');
            link.textContent = file.name;
            link.href = URL.createObjectURL(file);
            link.target = "_blank";
            link.className = 'file-link';

            // Create download button
            let downloadBtn = document.createElement('a');
            downloadBtn.textContent = "⬇ Download";
            downloadBtn.href = URL.createObjectURL(file);
            downloadBtn.download = file.name;
            downloadBtn.className = 'download-btn';

            fileContainer.appendChild(link);
            fileContainer.appendChild(downloadBtn);

            noteDiv.appendChild(fileContainer);
        }
    }

    notesContainer.appendChild(noteDiv);

    // Clear form
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';
    document.getElementById('noteFile').value = '';
}
