var IndexView = function IndexView() {
    
    this.joinRoomEvent = new Event(this);
    this.createRoomEvent = new Event(this);

    this.init();
}

IndexView.prototype = {

    init: function () {
        this.createElements()
            .setupHandlers()
            .enableEvents();
    },

    createElements: function () {
        // Get the document objects
        this.$joinRoomButton = $('#joinRoom');
        this.$createRoomButton = $('#createRoom');

        return this;
    },

    setupHandlers: function () {
        this.joinRoomButtonHandler = this.joinRoomButton.bind(this);
        this.createRoomButtonHandler = this.createRoomButton.bind(this);
        
        // Handlers from Event Handlers
        this.joinRoomHandler = this.joinRoom.bind(this);
        this.createRoomHandler = this.createRoom.bind(this);

        return this;
    },

    enableEvents: function() {
        this.$joinRoomButton.click(this.joinRoomButtonHandler);
        this.$createRoomButton.click(this.createRoomButtonHandler);

        // Event Handlers
        this.joinRoomEvent.attach(this.joinRoomHandler);
        this.createRoomEvent.attach(this.createRoomHandler);

        return this;
    },

    joinRoomButton: function () {
        this.joinRoomEvent.notify();
    },

    createRoomButton: function () {
        this.createRoomEvent.notify();
    },

    joinRoom: function () {
        alert("Join Room");
    },

    createRoom: function () {
        alert("Create Room");
    }

}
