var socket = io();
socket.on('connect', () => {
    console.log('Connected to server');


})
socket.on('disconnect', () => {
    console.log('Disconnected from server');

})

socket.on('newEmail', (email) => {
    console.log('New email...', email);

})
socket.on('newMessage', (message) => {
    console.log('newMessage: ', message);
    var li = jQuery('<li></li>');
    li.text(`${message.from}:  ${message.text}`)
    jQuery('#messages').append(li);

})
socket.on('newLocationMessage', (message) => {
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My current location</a>');
    li.text(`${message.from}: `);
    a.attr('href', message.url)
    li.append(a);
    jQuery('#messages').append(li);

})
socket.emit('createMessage', {
    from: 'asm',
    text: 'hi'
}, (data) => {
    console.log('Got it', data);

})
jQuery('#message-form').on('submit', (e) => {
    e.preventDefault();
    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, () => {

    })
})

var locationButton = jQuery('#send-location');
locationButton.on('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })

    }, () => {
        alert('Unable to fetch location')
    })
})