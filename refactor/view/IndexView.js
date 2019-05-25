var IndexView = function IndexView() {
    
    this.joinRoomEvent = new Event(this);
    this.createRoomEvent = new Event(this);

    this.init();
}

IndexView.prototype = {

    init: function () {
        
        this.$joinRoomButton = $('#joinRoom');

        this.joinRoomButtonHandler = this.joinRoomButton.bind(this);
        
        this.joinRoomHandler = this.joinRoom.bind(this);

        this.$joinRoomButton.click(this.joinRoomButtonHandler);

        this.joinRoomEvent.attach(this.joinRoomHandler);

    },

    joinRoomButton: function () {
        this.joinRoomEvent.notify();
    },

    joinRoom: function () {
        alert("Test");
    }

}
