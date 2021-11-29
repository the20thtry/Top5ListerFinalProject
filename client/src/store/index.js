import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from '../api'
import MoveItem_Transaction from '../transactions/MoveItem_Transaction'
import UpdateItem_Transaction from '../transactions/UpdateItem_Transaction'
import AuthContext from '../auth'


/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    UNMARK_LIST_FOR_DELETION: "UNMARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_ITEM_EDIT_ACTIVE: "SET_ITEM_EDIT_ACTIVE",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    SET_VIEW_ACTIVE: "SET_VIEW_ACTIVE"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        itemActive: false,
        listMarkedForDeletion: null,
        viewActive:false
    });
    const history = useHistory();

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    viewActive: store.viewActive

                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    viewActive:  store.viewActive

                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    viewActive:  store.viewActive

                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    viewActive:  store.viewActive

                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: payload,
                    viewActive:  store.viewActive

                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.UNMARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    viewActive:  store.viewActive

                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    viewActive:  store.viewActive

                });
            }
            // START EDITING A LIST ITEM
            case GlobalStoreActionType.SET_ITEM_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: true,
                    listMarkedForDeletion: null,
                    viewActive:  store.viewActive,

                });
            }
            // START EDITING A LIST NAME 
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: true,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    viewActive:  store.viewActive
                });
            }
            case GlobalStoreActionType.SET_VIEW_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: true,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    viewActive: true
                });
            }
            default:
                return store;
        }
    }

    //takes the temporary list and returns a reformatted [[]] that we can use as item for updating the user
    //gets all top5listnamepairs and the items which come with them
    store.reformatAllTop5Lists = async function (){
        let items=[]
        let result=[]
        let temp,temp1,temp2,temp3,temp4,temp5;
        temp1=[];temp2=[];temp3=[];temp4=[];temp5=[]
        try{ //GET name, items, 
            let response =await api.getAllTop5Lists()
            let allTop5Lists= response.data.data
            for(let i =0; i< allTop5Lists.length;i++){
                temp=([allTop5Lists[i]._id, allTop5Lists[i].name])
                for(let j =0; j< 5;j++){
                    temp.push(allTop5Lists[i].items[j])
                }
                items.push(temp)
                temp1.push(allTop5Lists[i].likes)
                temp2.push(allTop5Lists[i].author)
                temp3.push(allTop5Lists[i].publishedDate)
                temp4.push(allTop5Lists[i].views)
                temp5.push(allTop5Lists[i].comments)
            }
        }
        catch{
            console.log("reformat went wrong, possibly due to empty list") //set everything tto empty in the user
        }
        finally {
            result["0"]=items
            result["1"]=temp1
            result["2"]=temp2
            result["3"]=temp3
            result["4"]=temp4
            result["5"]=temp5
            return result 
        }
    }

    store.updateTempTop5Lists = async function (newLists="") {
        try{ //delete all then use user's info to create new lists
            let top5ListsResponse= await api.getAllTop5Lists()
            if(top5ListsResponse){
                for(let i=0;i<top5ListsResponse.data.data.length;i++){
                    await api.deleteTop5ListById(top5ListsResponse.data.data[i]._id)
                }
            }    
        }
        catch{ //if getalltop5list results in error, that means the lists are empty
            console.log("error with updatetempTop5List")
        }
        finally{
            if(newLists==""){
                for(let i=0;i<auth.user.items.length;i++){
                    let top5List={
                        _id:auth.user.items[i][0],
                        name:auth.user.items[i][1],
                        items:auth.user.items[i].slice(2),
                        likes:auth.user.likes[i],
                        author:auth.user.author[i],
                        publishedDate:auth.user.publishedDate[i], 
                        views:auth.user.views[i],
                        comments:auth.user.comments[i],
                    }
                    await api.createTop5List(top5List)
                }
            }
            if(newLists!=""){
                for(let i=0;i<newLists.length;i++){
                    await api.createTop5List(newLists[i])
                }
            }

        }
    }

    store.getAllUserTop5Lists = async function () {
        let response= await api.getAllUserTop5Lists()
        if (response.data.success==true){
            return response.data
        }
        else{
            console.log("getAllUserTop5Lists in store has failed")
        }
    }

    store.getUserTop5ListById = async function (id){
        let response= await store.getAllUserTop5Lists()
        if (response){
            let listOfUsers=response.data
            for(let i=0;i<listOfUsers.length;i++){ //loops through many users
                for(let j=0; j<listOfUsers[i].items.length;j++){ //loops through individual user's many lists
                    let tempId=listOfUsers[i].items[j][0] 
                    if(tempId.charAt(0)=="\""){
                        tempId=tempId.substring(1,tempId.length-1)//gets if of the "" at start and end of id for user items
                    }
                    if(id==tempId){
                        return [{"user":listOfUsers[i]},{"listNumber":j}]
                    }
                }
            }
        }
        else{
            console.log("listCard failed to get all UserTop5lists")
        }
    }

    store.publishList = async function(id){
        let top5list= (await api.getTop5ListById(id)).data.top5List
        top5list["email"]=auth.user.email
        console.log(top5list)
        api.publishTop5List(top5list)
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = async function (id, newName,publishedDate="unpublished") {
        let response = await api.getTop5ListById(id);
        if (response.data.success) {
            let top5List = response.data.top5List;
            top5List.name = newName;
            top5List.publishedDate=publishedDate
            async function updateList(top5List) {
                response = await api.updateTop5ListById(top5List._id, top5List);//this line doesnt work somehow?
                if (response.data.success) {
                    async function getListPairs(top5List) {
                        response = await api.getTop5ListPairs();
                        if (response.data.success) {
                            let pairsArray = response.data.idNamePairs;
                            storeReducer({
                                type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                payload: {
                                    idNamePairs: pairsArray,
                                    top5List: top5List
                                }
                            });
                        }
                    }
                    getListPairs(top5List);
                }
            }
            await updateList(top5List);
        }
        store.saveTempListToUser()
    }

    store.saveTempListToUser = async function () {
        try{
            let result= await store.reformatAllTop5Lists()
            let newUserData= await api.updateUser(auth.user.email, result)
            auth.user=newUserData.data.user    
        }
        catch{
            console.log("saveTempListToUser failed")
        }
    }


    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        
        tps.clearAllTransactions();
        history.push("/");
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let newListName = "Untitled" + store.newListCounter;
        let defaultLikes=[[],[]]
        let defaultAuthor=auth.user.firstName + " " +auth.user.lastName
        let defaultpublishedDate="unpublished"
        let defaultViews=0
        let defaultComment=[]
        let payload = {
            name: newListName,
            items: ["To publish, no slot can be empty", "and no items can repeat", "1", "1", "1"],
            likes:defaultLikes,
            author:defaultAuthor,
            publishedDate:defaultpublishedDate,
            views:defaultViews,
            comments:defaultComment,
            ownerEmail: auth.user.email
        };
        const response = await api.createTop5List(payload);
        if (response.data.success) {
            tps.clearAllTransactions();
            let newList = response.data.top5List;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            }
            );
            let item=auth.user.items
            item.push([JSON.stringify(response.data.top5List._id),"Untitled" +this.newListCounter,"To publish, no slot can be empty","and no items can repeat",1,1,1])
            let updatedInfo =[]
            updatedInfo["0"]=item
            let temp= auth.user.likes
            temp.push(defaultLikes)
            updatedInfo["1"]=temp
            temp=auth.user.author
            temp.push(defaultAuthor)
            updatedInfo["2"]=temp
            temp= auth.user.publishedDate
            temp.push(defaultpublishedDate)
            updatedInfo["3"]=temp
            temp= auth.user.views
            temp.push(defaultViews)
            updatedInfo["4"]=temp
            temp= auth.user.comments
            temp.push(defaultComment)
            updatedInfo["5"]=temp

            let newUserData= await api.updateUser(auth.user.email, updatedInfo)
            auth.user=newUserData.data.user
            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            history.push("/top5list/" + newList._id);
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    store.updatePublishedLists = async function () {
        let response = await store.getAllUserTop5Lists()
        let Users=response.data
        for(let i =0;i<Users.length;i++){
            for(let j=0;j<Users[i].publishedDate.length;j++){
                if(Users[i].publishedDate[j]!="unpublished"){ //these are published lists,  now update them
                    let top5List=[]
                    top5List["0"]=Users[i].items[j][1]
                    top5List["1"] = (Users[i].items[j]).slice(2,7)
                    top5List["2"]=Users[i].author[j]
                    top5List["3"]=Users[i].likes[j]
                    top5List["4"]=Users[i].comments[j]
                    top5List["5"]=Users[i].publishedDate[j]
                    top5List["6"]=Users[i].views[j]

                    await api.updatePublishedTop5ListById(Users[i].items[j][0],(top5List))
                }
            }
        }
    }

    function getMonthFromString(mon){
        return new Date(Date.parse(mon +" 1, 2012")).getMonth()+1
     }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = async function (searchCategory="HomeIcon", searchValue=0) {
        console.log(searchValue)
        store.updatePublishedLists()
        console.log("loading idnamepairs, search Category is: " + searchCategory)
            if(auth.user){
                try{
                    console.log(searchCategory)
                    if(searchCategory=="HomeIcon"){
                        await store.updateTempTop5Lists()
                    }
                    else if(searchCategory=="GroupsIcon"){
                        const response1 = await api.getPublishedTop5ListPairs();
                        await store.updateTempTop5Lists(response1.data.data)
                    }
                    const response = await api.getTop5ListPairs();
                    if (response.data.success) {
                        let pairsArray = response.data.idNamePairs;
                        if(searchValue==1 || searchValue==2 ){
                            pairsArray=pairsArray.sort(function(a, b){
                                a=a["publishedDate"].split(" ")
                                b=b["publishedDate"].split(" ")
                                a[0]= getMonthFromString(a[0])
                                b[0]= getMonthFromString(b[0])
                                if(a==["unpublished"])
                                    return -1
                                else if(b==["unpublished"])
                                    return 1
                                if(a[2]>b[2])
                                    return 1
                                else if(b[2]>a[2])
                                    return -1
                                else{
                                    if(a[0]>b[0])
                                        return 1
                                    else if(a[0]<b[0])
                                     return-1
                                    else{
                                        return a[1] < b[1] ? -1 : (a[1] > b[1] ? 1 : 0);                                    
                                }
                                }
                            });
                            if(searchValue==2){
                                pairsArray.reverse()
                            }
                        }
                        if(searchValue==3){
                            pairsArray=pairsArray.sort(function(a, b){
                            a=a["views"]
                            b=b["views"]
                            return a < b ? 1 : (a > b ? -1 : 0);     
                            })
                        }
                        if(searchValue==4){
                            pairsArray=pairsArray.sort(function(a, b){
                                a=a["likes"][0].length
                                b=b["likes"][0].length
                                return a < b ? 1 : (a > b ? -1 : 0);     
                                })
                        }
                        if(searchValue==5){
                            pairsArray=pairsArray.sort(function(a, b){
                                a=a["likes"][1].length
                                b=b["likes"][1].length
                                return a < b ? 1 : (a > b ? -1 : 0);     
                                })
                        }
                        storeReducer({
                            type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                            payload: pairsArray
                        });
                    }
                }
                catch{
                    console.log("error, loadidnamepair failed")
                }
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = async function (id) {
        // GET THE LIST
        let response = await api.getTop5ListById(id);
        if (response.data.success) {
            let top5List = response.data.top5List;
            storeReducer({
                type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                payload: top5List
            });
        }
    }
    store.getSelectedIcon = function (){
        let allIcons=document.getElementsByClassName("MuiButtonBase-root MuiFab-root MuiFab-circular MuiFab-sizeLarge css-a8igs1-MuiButtonBase-root-MuiFab-root")
        for(let i=0;i<allIcons.length;i++){
            if(allIcons[i].selected==true){
                return allIcons[i].id
            }
        }
    }

    store.deleteList = async function (listToDelete) {
        if(listToDelete.publishedDate!="unpublished"){
            await api.deletePublishedTop5ListById(listToDelete._id);
        }
        let response = await api.deleteTop5ListById(listToDelete._id);
        if (response.data.success) {
            store.saveTempListToUser()
            await store.updateTempTop5Lists()
            store.loadIdNamePairs()
        }
    }

    store.deleteMarkedList = function () {
        store.deleteList(store.listMarkedForDeletion);
    }

    store.unmarkListForDeletion = function () {
        storeReducer({
            type: GlobalStoreActionType.UNMARK_LIST_FOR_DELETION,
            payload: null
        });
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = async function (id) {
        let response = await api.getTop5ListById(id);
        if (response.data.success) {
            let top5List = response.data.top5List;

            response = await api.updateTop5ListById(top5List._id, top5List);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: top5List
                });
                history.push("/top5list/" + top5List._id);
            }
        }
    }

    store.addMoveItemTransaction =  function (start, end) {
        let transaction = new MoveItem_Transaction(store, start, end);
        tps.addTransaction(transaction);    
        console.log(tps)
        console.log(store.canUndo())
        console.log(store.canRedo())


    }

    store.addUpdateItemTransaction = function (index, newText) {
        let oldText = store.currentList.items[index];
        let transaction = new UpdateItem_Transaction(store, index, oldText, newText);
        tps.addTransaction(transaction);
        console.log(tps)
        console.log(store.canUndo())
    }

    store.moveItem = async function (start, end) {
        start -= 1;
        end -= 1;
        if (start < end) {
            let temp = store.currentList.items[start];
            for (let i = start; i < end; i++) {
                store.currentList.items[i] = store.currentList.items[i + 1];
            }
            store.currentList.items[end] = temp;
        }
        else if (start > end) {
            let temp = store.currentList.items[start];
            for (let i = start; i > end; i--) {
                store.currentList.items[i] = store.currentList.items[i - 1];
            }
            store.currentList.items[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        await store.updateCurrentList();
        store.saveTempListToUser()
}

    store.updateItem = async function (index, newItem) {
        store.currentList.items[index] = newItem;
        await store.updateCurrentList();
        store.saveTempListToUser()

    }

    store.updateCurrentList = async function () {
        const response = await api.updateTop5ListById(store.currentList._id, store.currentList);
        if (response.data.success) {
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_LIST,
                payload: store.currentList
            });
        }
    }

    store.undo = function () {
        tps.undoTransaction();
    }

    store.redo = function () {
        tps.doTransaction();
    }

    store.canUndo = function() {
        return tps.hasTransactionToUndo();
    }

    store.canRedo = function() {
        return tps.hasTransactionToRedo();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

        // THIS FUNCTION ENABLES THE PROCESS OF opening a list
    store.setViewActive = function () {
            storeReducer({
                type: GlobalStoreActionType.SET_VIEW_ACTIVE,
                payload: null
            });
        }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING AN ITEM
    store.setIsItemEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_ITEM_EDIT_ACTIVE,
            payload: null
        });
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };