var IndexController = function (model, view) {
    this.model = model;
    this.view = view;

    this.init();
}

IndexController.prototype = {

    init: function () {
        this.setupHandlers()
            .enableEvents();
    },

    setupHandlers: function () {
        
        this.joinRoomHandler = this.joinRoom.bind(this);
        this.createRoomHandler = this.createRoom.bind(this);

        return this;
    },

    enableEvents: function () {
        
        this.view.joinRoomEvent.attach(this.joinRoomHandler);
        this.view.createRoomEvent.attach(this.createRoomHandler);

        return this;
    },

    joinRoom: function () {
        console.log($("#roomCodeInput").val());
    },

    createRoom: function () {
        console.log("Create Room Button Pressed");
    }

}
