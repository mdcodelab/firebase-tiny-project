const list = document.querySelector('ul');
const form = document.querySelector('form');
const button = document.querySelector('button');


//get data from firestore
const addRecipe = ((recipe, id)=> {
const time = recipe.created_at.toDate();
const html = `<li data-id=${id}><div>${recipe.title}</div><div>${time}</div><button class="btn btn-danger">Delete</button></li>`;
list.innerHTML += html;
});

//adding new recipes
form.addEventListener('submit', e=> {
e.preventDefault();

const now = new Date();
let recipe = {
title: form.recipe.value,
created_at: firebase.firestore.Timestamp.fromDate(now)
}
db.collection('recipes').add(recipe).then(()=> {
console.log('recipe added');
});
});

//delete recipes
list.addEventListener('click', e=> {
if(e.target.tagName === 'BUTTON'){
const id = e.target.parentElement.getAttribute('data-id');

db.collection('recipes').doc(id).delete().then(()=> {
console.log('recipe deleted');
});
};
});

const removeRecipe = (id)=> {
const lis = document.querySelectorAll('li');
lis.forEach(recipe => {
if(recipe.getAttribute('data-id') === id){
    recipe.remove();
};
});
};


const unsub = db.collection('recipes').onSnapshot((snapshot) => {
console.log(snapshot.docChanges());
snapshot.docChanges().forEach(change=> {
if(change.type === 'added'){
addRecipe(change.doc.data(), change.doc.id);
} else if(change.type === 'removed'){
removeRecipe(change.doc.id);
};
});
});

//unsub rom database changes
button.addEventListener('click', e=> {
unsub();
console.log('unsubscribed from collection changes');
});

// db.collection('recipes').get().then(snapshot=> {
// snapshot.docs.forEach(doc=> {
// console.log(doc.data());
// addRecipe(doc.data(), doc.id);
// });
// });