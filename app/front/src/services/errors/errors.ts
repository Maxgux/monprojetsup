export class NonIdentifiéError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, NonIdentifiéError.prototype);
  }
}

export class NonAutoriséError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, NonAutoriséError.prototype);
  }
}

export class RequêteInvalideError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, RequêteInvalideError.prototype);
  }
}

export class NonTrouvéError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, NonTrouvéError.prototype);
  }
}

export class ServeurTemporairementIndisponibleError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ServeurTemporairementIndisponibleError.prototype);
  }
}

export class HttpGénériqueError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, HttpGénériqueError.prototype);
  }
}
