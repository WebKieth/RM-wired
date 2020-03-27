import axios from 'axios';
import {AlertCaller} from '../components/common/Alert'
import {LoaderCaller} from '../components/common/Loader'
import userStore from '../components/store/UserStore'
// import qs from 'qs'



class Ajax {
    constructor() {
        const domain = this.getDomain();
        this.baseUrl = process.env.REACT_APP_PROXY === '1' ? 'http://localhost:3001' : `https://${domain}/api/v1`;
        this.dadataToken = 'Token b8126af927e2b8f9ba854b03921bd17ef48dc075';
        this.userStore = userStore;
    }

    _wrapFormData(source) {
        let fd = new FormData();
        Object.keys(source).forEach(key => {
            fd.append(key, source[key])
        })
        return fd
    }

    getDomain() {
        let  serverDomain = 'core.seller24.ru';
        let parts = location.host.split('.');
        if (parts[0] === 'app') serverDomain = 'app.seller24.ru';
        return serverDomain
    }

    /*
    function for merging new options with current. Always use for accept into axios options
    */

    _resolveRequestOptions(url, body, file, method, dadata = false) {
        url = dadata ? url : `${this.baseUrl}${url}`
        let customOpts = {url: url, method: method, headers: {}};
        customOpts.headers = {
            'X-Requested-With': 'XMLHttpRequest'
        }
        if (this.userStore.token && !dadata) {
            customOpts.headers['X_ACCESS_TOKEN'] = this.userStore.token
        } else if (dadata) {
            customOpts.headers['Authorization'] = this.dadataToken
        }
        if (method === 'POST') {
            if (file === true) {
                customOpts['data'] = this._wrapFormData(body)
                customOpts.headers['Content-Type'] = 'application/x-www-form-urlencoded'
            }
            else {
                customOpts['data'] = body
                customOpts.headers['Content-Type'] = 'application/json'
            }
        } else {
            customOpts['params'] = body
            customOpts.headers['Content-Type'] = 'application/json'
            customOpts['data'] = {}
        }
        return Object.assign({}, this.options, customOpts)
    }
    /*
    Options:
    url: String
    body: Object, which will be stringified
    preventFail: bool, preventing basic error defining
    success: Function, on successed. Args: resp
    fail: Function, on fail. Args: error
    */
    get({
        loadOverlay = null,
        url = '',
        body = {},
        dadata = false,
        success = () => {return false},
        fail = null,
        finish = () => {return false}
    } = {}) {
        const Loader = new LoaderCaller();
        if (loadOverlay) Loader.create(loadOverlay)
        axios(this._resolveRequestOptions(url, body, false, 'GET', dadata)).then((resp) => {
            if (success) success(resp)
        })
        .catch(err => {
            this._handleError(err, fail)
        })
        .finally( () => {
            finish()
            if (loadOverlay) Loader.destroy()
        })
    }
    patch({url, body, success, fail, finish}) {
        axios(this._resolveRequestOptions(url, body, false, 'PATCH')).then((resp) => {
            if (success) success(resp)
        })
        .catch(err => {
            this._handleError(err, fail)
         })
         .finally(() => {
             if (finish) finish()
         })
    }
    post({url, loadOverlay, body, file = false, success, fail, finish, dadata}) {
        const Loader = new LoaderCaller();
        if (loadOverlay) Loader.create(loadOverlay)
        axios(this._resolveRequestOptions(url, body, file, 'POST', dadata)).then((resp) => {
           if (success) success(resp)
        })
        .catch(err => {
           this._handleError(err, fail)
        })
        .finally(() => {
            if (finish) finish()
            if (loadOverlay) Loader.destroy()
        })
    }

    delete({url, body, success, fail, finish}) {
        axios(this._resolveRequestOptions(url, body, false, 'DELETE')).then((resp) => {
           if (success) success(resp)
        })
        .catch(err => {
           this._handleError(err, fail)
        })
        .finally(() => {
            if (finish) finish()
        })
    }

    _handleError(error, failCb) {
        console.warn(error)
        if (error.response && error.response.status === 401) {
            userStore.logout(error)
        }
        const postAction = () => {
            new AlertCaller({children: error.message, warn: true});
        }
        if (failCb) failCb(error, postAction)
        else postAction()
    }
}

const ajax = new Ajax();

export {ajax};