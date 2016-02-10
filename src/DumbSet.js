
export default class DumbSet {
    constructor(...startingMembers) {
        this.members = [];
        startingMembers.forEach(member => this.addMember(member));
    }

    addMember(member) {
        if (this.members.indexOf(member) >= 0) return false;
        this.members.push(member);
        return true;
    }

    removeMember(member) {
        var i = this.members.indexOf(member);
        if (i < 0) return false;
        this.members.splice(i, 1);
        return true;
    }
}
