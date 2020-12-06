import Formula from "./Formula";

class Disjunction extends Formula {

  constructor(subLeft, subRight) {
    super([subLeft, subRight]);
  }

  toString() {
    return `(${this.subfs[0].toString()} ∨ ${this.subfs[1].toString()})`;
  }

}

export default Disjunction;