const expect = require('expect');

const { Users } = require('./users');


describe('Users', () => {

    var users;
    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Mike',
            room: 'Node Course'
        }, {
            id: '2',
            name: 'Jen',
            room: 'React Course'
        }, {
            id: '3',
            name: 'Julie',
            room: 'Node Course'
        }]
    })

    it('should add new user', () => {
        var users = new Users();
        var user = {
            id: 'sjlkfj',
            name: 'asmmorshed',
            room: 'officeroom'
        }
        var response = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user])
    })
    it('Should remove a user', () => {
        var userId = '1';
        var user = users.removeUser(userId);

        expect(user.id).toBe(userId)
        expect(users.users.length).toBe(2);
    });
    it('Should not remove a user', () => {
        var userId = '11';
        var user = users.removeUser(userId);

        expect(user).toBeFalsy();
        expect(users.users.length).toBe(3);
    });
    it('Should find a user', () => {
        var userId = '2';
        var user = users.getUser(userId);
        expect(user.id).toBe(userId)
    });
    it('Should not find a user', () => {
        var userId = '11';
        var user = users.getUser(userId);
        expect(user).toBeFalsy();
    });
    it('Should return name for node course', () => {
        var userList = users.getUserList('Node Course');
        expect(userList).toEqual(['Mike', 'Julie']);
    })
    it('Should return name for react course', () => {
        var userList = users.getUserList('React Course');
        expect(userList).toEqual(['Jen']);
    })
})