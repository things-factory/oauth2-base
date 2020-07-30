import { AbstractAuthPage } from './abstract-auth-page'

export class AbstractSign extends AbstractAuthPage {
  async submit() {
    this.formEl.submit()
  }

  updated(changed) {
    super.updated(changed)

    if (changed.has('message')) {
      if (!this.message) {
        this.hideSnackbar()
      } else {
        this.showSnackbar({
          level: 'error',
          timer: -1
        })
      }
    }
  }
}
