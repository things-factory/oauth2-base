import { html, css, LitElement } from 'lit-element'
import gql from 'graphql-tag'
import { connect } from 'pwa-helpers/connect-mixin.js'
import { client, store, PageView } from '@things-factory/shell'

class Applications extends connect(store)(PageView) {
  static get properties() {
    return {
      applications: Array
    }
  }

  render() {
    var apps = this.applications || []

    return html`
      <ul>
        ${apps.map(
          app => html`
        <li>
          <h2><a href=${`application/${app.id}`}>${app.name}</a></h3>
          <h3>${app.description}</h3>
        </li>
      `
        )}
      </ul>

      <a href="register-app">create app</a>
    `
  }

  updated(changes) {
    /*
     * If this page properties are changed, this callback will be invoked.
     * This callback will be called back only when this page is activated.
     */
    if (changes.has('applications')) {
      /* do something */
    }
  }

  stateChanged(state) {
    /*
     * application wide state changed
     *
     */
  }

  /*
   * page lifecycle
   *
   * - pageInitialized(lifecycle)
   * - pageUpdated(changes, lifecycle, changedBefore)
   * - pageDisposed(lifecycle)
   *
   * lifecycle value has
   * - active : this page is activated
   * - page : first path of href
   * - resourceId : second path of href
   * - params : search params object of href
   * - initialized : initialized state of this page
   *
   * you can update lifecycle values, or add custom values
   * by calling this.pageUpdate({ ...values }, force)
   * If lifecycle values changed by this.pageUpdate(...),
   * this.pageUpdated(...) will be called back right after.
   * If you want to invoke this.pageUpdated(...) callback,
   * set force argument to true.
   *
   * you can re-initialize this page
   * by calling this.pageReset().
   * this.pageInitialized(...) followed by this.pageDispose(...) will be invoked
   * by calling this.pageReset().
   *
   * you can invoke this.pageDisposed()
   * by calling this.pageDispose()
   */

  pageInitialized(lifecycle) {
    /*
     * This page is initialized.
     * It's right time to configure of this page.
     *
     * - called before when this page activated first
     * - called when i18next resource is updated (loaded, changed, ..)
     * - called right after this.pageReset()
     */
  }

  async pageUpdated(changes, lifecycle, before) {
    if (this.active) {
      /*
       * this page is activated
       */
      this.applications = (await this.fetchApplications()).items
    } else {
      /* this page is deactivated */
    }
  }

  pageDisposed(lifecycle) {
    /*
     * This page is disposed.
     * It's right time to release system resources.
     *
     * - called just before (re)pageInitialized
     * - called right after when i18next resource updated (loaded, changed, ..)
     * - called right after this.pageReset()
     * - called right after this.pageDispose()
     */
  }

  async fetchApplications() {
    const response = await client.query({
      query: gql`
        query {
          applications {
            items {
              id
              name
              description
            }
            total
          }
        }
      `
    })

    if (!response.errors) {
      return response.data.applications
    }
  }
}

window.customElements.define('applications-page', Applications)
