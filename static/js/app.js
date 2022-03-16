(function() {
    'use strict';

    // ----------------------------------------------------
    // Configure Pusher instance
    // ----------------------------------------------------
/*
    var pusher = new Pusher('PUSHER_APP_KEY', {
        authEndpoint: '/pusher/auth',
        cluster: 'PUSHER_APP_SECRET',
        encrypted: true
      });
*/
    // ----------------------------------------------------
    // Chat Details
    // ----------------------------------------------------

    let chat = {
        name:  undefined,
        myChannel: undefined,
    }


    // ----------------------------------------------------
    // Targeted Elements
    // ----------------------------------------------------

    const chatPage   = $(document)
    const chatWindow = $('.chatbubble')
    const chatHeader = chatWindow.find('.unexpanded')
    const chatBody   = chatWindow.find('.chat-window')


    // ----------------------------------------------------
    // Register helpers
    // ----------------------------------------------------

    let helpers = {

    // ----------------------------------------------------
    // Toggles the display of the chat window.
    // ----------------------------------------------------

        ToggleChatWindow: function () {
            chatWindow.toggleClass('opened')
            chatHeader.find('.title').text(
                chatWindow.hasClass('opened') ? 'Minimize Chat Window' : 'Chat with Support'
            )
        },
    // --------------------------------------------------------------------
    // Show the appropriate display screen. Login screen or Chat screen.
    // --------------------------------------------------------------------

        ShowAppropriateChatDisplay: function () {
            (chat.name) ? helpers.ShowChatRoomDisplay() : helpers.ShowChatInitiationDisplay()
        },

    // ----------------------------------------------------
    // Show the enter details form.
    // ----------------------------------------------------

        ShowChatInitiationDisplay: function () {
            //console.log("ShowChatInitiationDisplay")
            //chatBody.find('.chats').removeClass('active')
            //chatBody.find('.login-screen').addClass('active')

            chatBody.find('.chats').hide()
            chatBody.find('.login-screen').show()
            
        },

    // ----------------------------------------------------
    // Show the chat room messages display.
    // ----------------------------------------------------

        ShowChatRoomDisplay: function () {
            //console.log("ShowChatRoomDisplay")
            //chatBody.find('.chats').addClass('active')
            //chatBody.find('.login-screen').removeClass('active')
            chatBody.find('.chats').show()
            chatBody.find('.login-screen').hide()
             
            setTimeout(function(){
                chatBody.find('.loader-wrapper').hide()
                chatBody.find('.input, .messages').show()
            }, 2000)
        },

    // ----------------------------------------------------
    // Append a message to the chat messages UI.
    // ----------------------------------------------------

        NewChatMessage: function (messageIn) {
            if (messageIn !== undefined) {
                const messageClass = messageIn.sender !== chat.email ? 'support' : 'user'

                chatBody.find('ul.messages').append(
                    `<li class="clearfix message ${messageClass}">
                        <div class="sender">${messageIn.name}</div>
                        <div class="message">${messageIn.text}</div>
                    </li>`
                )


                chatBody.scrollTop(chatBody[0].scrollHeight)
            }
        },

    // ----------------------------------------------------
    // Send a message to the chat channel.
    // ----------------------------------------------------

    SendMessageToSupport: function (evt) {
        evt.preventDefault()

        let createdAt = new Date()
        createdAt = createdAt.toLocaleString()
        
        var message = $('#newMessage').val()
        /*chat.myChannel.trigger('client-guest-new-message', {
            'sender': chat.name,
            'email': chat.email,
            'text': message,
            'createdAt': createdAt
        });*/
        //console.log(message)
        helpers.NewChatMessage({
            'text': message,
            'name': chat.name,
            //'sender': chat.email
        })

        console.log("Message added!  ", message, "----", chat.name)

        $('#newMessage').val('')
    },

    // ----------------------------------------------------
    // Logs user into a chat session.
    // ----------------------------------------------------

        LogIntoChatSession: function (evt) {
            const name  = $('#nickname').val().trim()
            
            // Disable the form
            chatBody.find('#loginScreenForm input, #loginScreenForm button').attr('disabled', true)

            if ((name !== '' && name.length >= 3) ) {
                    //console.log(name)
                    chat.name = name
                    helpers.ShowAppropriateChatDisplay()
                    //helpers.ShowChatRoomDisplay()
            } else {
                alert('Enter a valid name and email.')
            }

            evt.preventDefault()
        }
    }

    // ------------------------------------------------------------------
    // Listen for a new message event from the admin
    // ------------------------------------------------------------------

    //pusher.bind('client-support-new-message', function(data){
    //    helpers.NewChatMessage(data)
    //})


    // ----------------------------------------------------
    // Register page event listeners
    // ----------------------------------------------------

    chatPage.ready(helpers.ShowAppropriateChatDisplay)
    chatHeader.on('click', helpers.ToggleChatWindow)
    chatBody.find('#loginScreenForm').on('submit', helpers.LogIntoChatSession)
    chatBody.find('#messageSupport').on('submit', helpers.SendMessageToSupport)
}())
