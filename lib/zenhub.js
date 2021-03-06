var extend = require('xtend');
var request = require('request');
var querystring = require('querystring');

var API_URL = 'https://api.zenhub.io/p1';

/**
 * ZenHub API Client
 * @constructor
 * @param string    token   Your account's ZenHub token
 * @author Matteo Magni <matteo@magni.me> (magni.me)
 */
var ZenHub = function(token) {
    this.credentials = {
        'access_token': token
    };
};
module.exports = ZenHub;

/**
 * Helper to handle requests to the API with authorization
 *
 * @private
 * @param string    url             address part after API root
 * @param object    parameters      additional parameters
 * @callback        complete
 * @memberof        ZenHub
 * @method          _get
 */
ZenHub.prototype._get = function(url, parameters, callback) {
    parameters = extend(parameters, this.credentials); // Add credentials to parameters
    var getURL = API_URL + '/' + url + '?' + querystring.stringify(parameters); // Construct URL with parameters

    request.get({
        url: getURL,
        strictSSL: true,
        json: true
    }, function(error, response, body) {
        if (!error && !!body.status && body.status !== 'OK') {
            error = new Error(body.description || body.error_message);
        }
        callback(error, body || {});
    });
};

/**
 * Helper to handle POST requests to the API with authorization
 *
 * @private
 * @param string    url             address part after API root
 * @param object    parameters      additional parameters
 * @param object    body            request body
 * @callback        complete
 * @memberof        ZenHub
 * @method          _post
 */
ZenHub.prototype._post = function(url, parameters, body, callback) {
    parameters = extend(parameters, this.credentials); // Add credentials to parameters
    var postURL = API_URL + '/' + url + '?' + querystring.stringify(parameters); // Construct URL with parameters

    request.post({
        url: postURL,
        strictSSL: true,
        json: true,
        body: body,
    }, function(error, response, body) {
        callback(error, body || {});
    });
};

/**
 * Helper to handle PUT requests to the API with authorization
 *
 * @private
 * @param string    url             address part after API root
 * @param object    parameters      additional parameters
 * @param object    body            request body
 * @callback        complete
 * @memberof        ZenHub
 * @method          _put
 */
ZenHub.prototype._put = function(url, parameters, body, callback) {
    parameters = extend(parameters, this.credentials); // Add credentials to parameters
    var putURL = API_URL + '/' + url + '?' + querystring.stringify(parameters); // Construct URL with parameters

    request.put({
        url: putURL,
        strictSSL: true,
        json: true,
        body: body,
    }, function(error, response, body) {
        callback(error, body || {});
    });
};

/**
 * Show All Pipelines in a repo board
 * This method returns all pipelines in a repo board
 * @param int   repoId      github id of repository
 * @callback    complete
 * @memberof    ZenHub
 * @method      getBoard
 */
ZenHub.prototype.getBoard = function (repoId, callback) {
    this._get('repositories/' + repoId + '/board', {}, function(error, body) {
        callback(error, body.pipelines);
    });
};

/**
 * Show issue information
 * This method returns all issue information
 * @param int   repoId      github id of repository
 * @param int   issueNumber github id of issue
 * @callback    complete
 * @memberof    ZenHub
 * @method      getIssue
 */
ZenHub.prototype.getIssue = function (repoId, issueNumber, callback) {
    this._get('repositories/' + repoId + '/issues/' + issueNumber, {}, function(error, body) {
        callback(error, body);
    });
};

/**
 * Show issue Events
 * This method returns all issue events
 * @param int   repoId      github id of repository
 * @param int   issueNumber github id of issue
 * @callback    complete
 * @memberof    ZenHub
 * @method      getIssueEvents
 */
ZenHub.prototype.getIssueEvents = function (repoId, issueNumber, callback) {
    this._get('repositories/' + repoId + '/issues/' + issueNumber + '/events', {}, function(error, body) {
        callback(error, body);
    });
};

/**
 * Get epics for a repository
 * This method returns an array of the repository's epics
 * @param int   repoId      github id of repository
 * @callback    complete
 * @memberof    ZenHub
 * @method      getEpics
 */
ZenHub.prototype.getEpics = function (repoId, callback) {
    this._get('repositories/' + repoId + '/epics', {}, function(error, body) {
        callback(error, body);
    });
};

/**
 * Show epic information
 * This method returns all data related to an epic
 * @param int   repoId      github id of repository
 * @param int   epicId      github id of issue marked as an epic
 * @callback    complete
 * @memberof    ZenHub
 * @method      getEpicData
 */
ZenHub.prototype.getEpicData = function (repoId, epicId, callback) {
    this._get('repositories/' + repoId + '/epics/' + epicId, {}, function(error, body) {
        callback(error, body);
    });
};

/**
 * Add and/or remove issues to an epic
 * This method updates the ZenHub metadata for the epic
 * @param int   repoId      github id of repository
 * @param int   epicId      github id of issue marked as an epic
 * @param object    payload      instructions for which issues to move, see https://github.com/ZenHubIO/API#add-or-remove-issues-to-epic for payload format
 * @callback    complete
 * @memberof    ZenHub
 * @method      addRemoveIssuesToEpic
 */
ZenHub.prototype.addRemoveIssuesToEpic = function (repoId, epicId, payload, callback) {
    this._post('repositories/' + repoId + '/epics/' + epicId + '/update_issues', {}, payload, function (error, body) {
        callback(error, body);
    });
};

/**
 * Convert issue to an epic
 * This method converts an issue to an epic on ZenHub. A list of issues to move to the new epic may optionally be specified.
 * @param int   repoId      github id of repository
 * @param int   issueId      github id of issue to convert
 * @param object    payload      contains list of issues to move to the epic, see https://github.com/ZenHubIO/API#convert-issue-to-epic for payload format
 * @callback    complete
 * @memberof    ZenHub
 * @method      convertIssueToEpic
 */
ZenHub.prototype.convertIssueToEpic = function (repoId, issueId, payload, callback) {
    this._post('repositories/' + repoId + '/issues/' + issueId + '/convert_to_epic', {}, payload, function (error, body) {
        callback(error, body);
    });
};

/**
 * Set estimate in issue
 * This method set estimate for an issue on ZenHub.
 * @param int   repoId      github id of repository
 * @param int   issueId      github id of issue to convert
 * @param object    payload      contains estimate to set for the issue, see https://github.com/ZenHubIO/API#set-estimate-for-issue for payload format
 * @callback    complete
 * @memberof    ZenHub
 * @method      setEstimateForIssue
 */
ZenHub.prototype.setEstimateForIssue = function (repoId, issueId, payload, callback) {
    this._put('repositories/' + repoId + '/issues/' + issueId + '/estimate', {}, payload, function (error, body) {
        callback(error, body);
    });
};
