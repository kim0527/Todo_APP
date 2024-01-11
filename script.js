const list=document.getElementById("list");
const createBtn=document.getElementById("create-btn");

let todos=[];

createBtn.addEventListener('click', createNewTodo);

function createNewTodo(){
    // 새로운 아이템 객체 생성
    const item={
        id: new Date().getTime(),
        text:"",
        complete: false
    }

    // 생성한 객체 배열에 넣기
    // unshift 배열의 첫번째에 insert해주는 것
    todos.unshift(item);

    //요소 생성하기
    const {itemEl,inputEl,editBtnEl,removeBtnEl} = createTodoElement(item)
    // 첫번째 child 앞에 추가 (not append)
    list.prepend(itemEl);

    inputEl.removeAttribute('disabled');
    inputEl.focus();

    saveToLocalStorage();
}

function createTodoElement(item){
    //div 요소 class=item 생성
    const itemEl=document.createElement("div");
    itemEl.classList.add('item')

    //checkbox
    const checkboxEl=document.createElement("input");
    checkboxEl.type="checkbox";
    checkboxEl.checked=item.complete;
    if (item.complete){
        itemEl.classList.add('complete');
    }
    //checkbox 속성인 checked로 true/false 전달
    checkboxEl.addEventListener('change',()=>{
        item.complete=checkboxEl.checked;
        if(item.complete){
            itemEl.classList.add('complete');
        }else{
            itemEl.classList.remove('complete');
        }
        saveToLocalStorage();
    })

    //input text
    const inputEl=document.createElement("input");
    inputEl.type="text";
    inputEl.value=item.text;
    //  input에 텍스트를 넣었을떄 (input이 발생했을때) item의 text에 전달
    inputEl.addEventListener('input',()=>{
        item.text=inputEl.value;
    })
    //input blur되면  disabled
    inputEl.addEventListener('blur',()=>{
        inputEl.setAttribute('disabled','');
        saveToLocalStorage();
    });
    //item class에 checkbox, input 넣기
    itemEl.append(checkboxEl);
    itemEl.append(inputEl);

    //################################################
    //disabled 텍스트를 입력할 수 없음
    inputEl.setAttribute('disabled','');
    //################################################

    //div 요소 class=action 생성
    const actionsEl = document.createElement("div");
    actionsEl.classList.add('actions');

    //edit button
    const editBtnEl=document.createElement("button"); 
    editBtnEl.classList.add('material-icons');
    editBtnEl.innerHTML="edit";
    //edit button 클릭시 disabled 해제 & focus
    editBtnEl.addEventListener('click',()=>{
        inputEl.removeAttribute('disabled');
        inputEl.focus();
    });

    //remove button
    const removeBtnEl = document.createElement("button");
    removeBtnEl.classList.add('material-icons','remove-btn');
    removeBtnEl.innerText = 'remove_circles';
    //remove button 클릭시 해당 list 삭제
    removeBtnEl.addEventListener('click',()=>{
        //id가 다른것만 todos배열 만들어서 다시 재정의
        //자동 삭제
        todos=todos.filter(t=>t.id !==item.id )
        itemEl.remove();
        saveToLocalStorage();
    });


    //item class에 checkbox, input 넣기
    actionsEl.append(editBtnEl);
    actionsEl.append(removeBtnEl);

    itemEl.append(actionsEl);

    return{itemEl,inputEl,editBtnEl,removeBtnEl}

}

//localStorage에 넣을때는 항상 string으로 넣어야한다.
function saveToLocalStorage(){
    //list->string
    const data=JSON.stringify(todos);
    //local에 저장
    window.localStorage.setItem('my_todos',data);
}

function loadFromLocalStorage(){
    const data = localStorage.getItem('my_todos');
    if(data){
        //string->list
        todos=JSON.parse(data)        
    }
}

//refresh 했을때 데이터 유지하기
function displayTodos(){
    loadFromLocalStorage();
    
    for (let i=0;i<todos.length;i++){
        const item=todos[i];
        const {itemEl} = createTodoElement(item);
        list.append(itemEl);
    }
}

displayTodos();