
export default class DumbSet {
    constructor(...startingMembers) {
        this.members = [];
        startingMembers.forEach(member => this.add(member));
    }

    add(member) {
        if (this.members.indexOf(member) >= 0) return false;
        this.members.push(member);
        return true;
    }

    remove(member) {
        let i = this.members.indexOf(member);
        if (i < 0) return false;
        this.members.splice(i, 1);
        return true;
    }

    get length() {
        return this.members.length;
    }
}
