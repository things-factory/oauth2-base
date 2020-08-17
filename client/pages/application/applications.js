import { html, css, LitElement } from 'lit-element'
import gql from 'graphql-tag'
import { connect } from 'pwa-helpers/connect-mixin.js'
import { client, store, PageView } from '@things-factory/shell'

class Applications extends connect(store)(PageView) {
  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;
          background-color: var(--main-section-background-color);
          padding: var(--padding-wide);
        }

        [button-primary] {
          background-color: var(--button-primary-background-color);
          border: var(--button-border);
          border-radius: var(--button-border-radius);
          margin: var(--button-margin);
          padding: var(--button-primary-padding);
          color: var(--button-primary-color);
          font: var(--button-primary-font);
          text-transform: var(--button-text-transform);

          text-decoration: none;
        }
        [button-primary]:hover {
          background-color: var(--button-primary-active-background-color);
          box-shadow: var(--button-active-box-shadow);
        }
        [button] {
          background-color: var(--button-background-color);
          border: var(--button-border);
          border-radius: var(--button-border-radius);
          margin: var(--button-margin);
          padding: var(--button-padding);
          color: var(--button-color);
          font: var(--button-font);
          text-transform: var(--button-text-transform);

          margin-right: 0;
          float: right;
          text-decoration: none;
        }
        [button]:hover {
          border: var(--button-activ-border);
          box-shadow: var(--button-active-box-shadow);
        }
        h2 {
          margin: var(--title-margin);
          font: var(--title-font);
          color: var(--title-text-color);
        }
        [page-description] {
          margin: var(--page-description-margin);
          font: var(--page-description-font);
          color: var(--page-description-color);
        }
        [page-description] nwc-icon {
          background-color: var(--primary-color);
          float: left;
          color: #fff;
        }
        div {
          margin: var(--margin-wide) 0;
        }
        table {
          background-color: var(--theme-white-color);
          border: var(--border-dark-color);

          width: 100%;
        }
        th {
          border-bottom: var(--border-dark-color);
          padding: var(--th-padding);

          font: var(--th-font);
          color: var(--secondary-color);
          text-transform: var(--th-text-transform);
        }
        td {
          padding: var(--td-padding);
          font: var(--td-font);
        }
        td a {
          color: var(--primary-color);
          font: bold 16px var(--theme-font);

          display: block;
          text-decoration: none;
        }
        .text-align-center {
          text-align: center;
        }
        .text-align-right {
          text-align: right;
        }
      `
    ]
  }

  static get properties() {
    return {
      applications: Array
    }
  }

  render() {
    var apps = this.applications || []

    return html`
      <div>
        <h2>Registered Applications</h2>
        <p page-description>
          What type of app are you building?<br />Choose the app type that best suits the audience you’re building for.
          The app type can’t be changed after it’s created.
        </p>
        <a href="register-app" button-primary>create app</a>
      </div>

      <div>
        <table>
          <tr>
            <th>app name</th>
            <th>API health</th>
            <th>Installs</th>
            <th>status</th>
          </tr>
          ${apps.map(
            app => html`
              <tr>
                <td>
                  <a href=${`application/${app.id}`}>${app.name}</a>
                  ${app.description}
                </td>
                <td class="text-align-center">OK</td>
                <td class="text-align-right">1</td>
                <td class="text-align-center">draft</td>
              </tr>
            `
          )}
        </table>
        <a href="app-bindings" button>bound applications ..</a>
      </div>
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
