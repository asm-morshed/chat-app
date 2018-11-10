var socket = io();

function scrollToBottom() {
  var messages = jQuery("#messages");
  var newMessage = messages.children("li:last-child");
  // Height
  var clientHeight = messages.prop("clientHeight");
  var scrollTop = messages.prop("scrollTop");
  var scrollHeight = messages.prop("scrollHeight");
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();
  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    messages.scrollTop(scrollHeight);
  }
}
socket.on("connect", () => {
  var params = jQuery.deparam(window.location.search);
  socket.emit('join', params, function (err) {
    if (err) {
      alert(err)
      window.location.href = '/';
    } else {
      console.log('No error');

    }
  })
});
socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

socket.on('updateUserList', (users) => {
  var ol = jQuery('<ol></ol>');
  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user))

  })
  jQuery('#users').html(ol)
})
socket.on("newEmail", email => {
  console.log("New email...", email);
});
socket.on("newMessage", message => {
  var formattedTime = moment(message.createdAt).format("h:mm a");
  var template = jQuery("#message-template").html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery("#messages").append(html);
  scrollToBottom();
  // console.log("newMessage: ", message);
  // var li = jQuery("<li></li>");
  // li.text(`${message.from} ${formattedTime}:  ${message.text}`);
  // jQuery("#messages").append(li);
});

socket.on("newLocationMessage", message => {
  var formattedTime = moment(message.createdAt).format("h:mm a");
  var template = jQuery("#location-message-template").html();
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });
  jQuery("#messages").append(html);
  scrollToBottom();
  // var li = jQuery("<li></li>");
  // var a = jQuery('<a target="_blank">My current location</a>');
  // li.text(`${message.from} ${formattedTime}: `);
  // a.attr("href", message.url);
  // li.append(a);
  // jQuery("#messages").append(li);
});

socket.emit(
  "createMessage",
  {
    from: "asm",
    text: "hi"
  },
  data => {
    console.log("Got it", data);
  }
);

jQuery("#message-form").on("submit", e => {
  e.preventDefault();
  socket.emit(
    "createMessage",
    {
      from: "User",
      text: jQuery("[name=message]").val()
    },
    () => {
      jQuery("[name=message]").val("");
    }
  );
});

var locationButton = jQuery("#send-location");
locationButton.on("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation not supported by your browser");
  }
  locationButton.attr("disabled", "disabled").text("Sending locaton...");
  navigator.geolocation.getCurrentPosition(
    position => {
      console.log(position);
      locationButton.removeAttr("disabled").text("Send locatoin");
      socket.emit("createLocationMessage", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
    () => {
      locationButton.removeAttr("disabled").text("Send location");

      alert("Unable to fetch location");
    }
  );
});
