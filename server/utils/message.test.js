const expect = require('expect');


var { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        var from = 'john';
        var text = 'hey whats up';
        var message = generateMessage(from, text);

        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({
            from,
            text
        })
    })
});

describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
        var from = 'asm';
        var latitude = 15;
        var longitude = 19;
        var url = 'https://www.google.com/maps?q=15,19';
        var message = generateLocationMessage(from, latitude, longitude)
    })
})