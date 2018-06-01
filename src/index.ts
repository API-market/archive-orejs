class Orejs {
  private config: string

  constructor(_config: string) {
    this.config = _config
  }

  public get() {
    return this.config
  }
}

export namespace Orejs {
  export Orejs
}
