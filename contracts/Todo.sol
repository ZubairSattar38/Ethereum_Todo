pragma solidity >=0.4.22 <0.8.0;

contract Todo{
    string public name  = "TodoList ";
    uint public todoCount=0;
    mapping(uint => todoStruct) public todos;
    mapping(uint => uint ) public removedId;
    struct todoStruct {
        uint id;
        string title;
        string description;
        address author;
    }
      event removedIdEvent(uint ID, bool returnValue);

    event todo (
        uint id,
        string title,
        string description,
        address author
    );
    constructor() public {
    }
    function checkExistInDelete(uint _id)  public returns (bool){
    if(removedId[_id] >0){
    emit removedIdEvent(_id,false);
            return false;
     }
        
    emit removedIdEvent(_id,true);
        return true;
}

    // function deleteElement(uint id) public{
    //         require(id>0);
    //         delete todos[id];
    //         removedId[id] = id;
    // }   
    function createTodo(string memory _title, string memory _description) public{
        require(bytes(_title).length>0);
        require(bytes(_description).length>0);

        // increment TodoApp
        todoCount++;
        // Store Data
        todos[todoCount] = todoStruct(todoCount,_title,_description,msg.sender);

        emit todo(todoCount,_title,_description,msg.sender);
    }
}