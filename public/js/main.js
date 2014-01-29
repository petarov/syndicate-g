/*
 * syndicate-g
 * https://github.com/petarov/syndicate-g
 *
 * The MIT License (MIT)
 * Copyright (c) 2013 Petar Petrov
 */

var app = {

    ajax: {
        serverUrl: '',
        useJsonp: false
    },

    // uhm...the following are completely random. Honestly!
    luckyGPlusers: [
        '118355576984899086023',
        '+LinusTorvalds',
        '+TeamCoco',
        '104560124403688998123',
        '+LarryPage',
        '+EnriqueIglesias',
        '+MariahCarey',
        '+Madonna',
        '+iamwill',
        '100300281975626912157',
        '+AprilSummers',
        '112009945208508693556',
        '+TaylorSwift',
        '+SnoopDogg',
        '+RichardBranson',
        '+JessiJune',
        '+britneyspears',
        '+DollyParton',
        '+myspacetom',
        '+VeronicaBelmont',
        '+JeriRyan',
        '+LilWayne',
        '+ParisHilton',
        '+TyraBanks',
        '+50Cent',
        '101483533411566453214',
        '+TreySongz'
    ],

    init: function() {
        //TODO
    },

    run: function() {
        this.init();
        this.bindEvents();
    },

    bindEvents: function() {
        var self = this;

        $(document).on('click', 'a[data-action="fetch"]', this.onSearch.bind(this));
        $(document).on('click', '#btnSearch', this.onSearch.bind(this));
        $(document).on('keyup', '#search', function(event) {
            event.preventDefault();
            if (event.which != 13) {
                return;
            }
            self.onSearch();
        });
        $(document).on('click', 'a[data-action="clearcache"]', this.onClearCache.bind(this));
        $(document).on('click', 'a[data-action="flucky"]', this.onFeelingLucky.bind(this));
    },

    doTheAjax: function(requestType, resource, params, headers, cb) {
        var self = this;
        $.ajax({type: requestType,
            url: self.ajax.serverUrl + resource,
            // dataType: self.ajax.useJsonp ? 'jsonp' : 'json',
            //jsonpCallback: 'callback',
            //jsonp: this.jsonp,
            data: params || {},
            headers: headers || {},
            // cache: !self.ajax.useJsonp,
            crossDomain: false,
        }).done(function(result) {
            cb && cb(null, result);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            cb && cb({'code': jqXHR.status, 'status': errorThrown, 'response': jqXHR.responseText}, null);
        });         
    },

    ajaxGET: function(resource, params, headers, cb) {
        if (typeof headers == "function") {
            cb = headers;
            headers = null;
        } else if (typeof params == "function") {
            cb = params;
            params = null;
            headers = null;
        }
        this.doTheAjax('GET', resource, params, headers, cb);
    },
    
    showAlertOK: function(message) {
        var $div = $('div.alert-success');
        $div.html(message);
        $div.show();
    },
    
    showAlertErr: function(message) {
        var $div = $('div.alert-danger');
        $div.html(message);
        $div.show();
    },

    /**
     * Fetch feed
     */
    onSearch: function() {
        var query = $('#search').val().trim();
        if (query.length > 0)
            window.location = '/fetch/' + query;
    },
    /**
     * Clear cached data for user given profile/user ID
     */
    onClearCache: function() {
        var self = this;
        var query = $('#search').val().trim();

        if (query.length > 0) {
            this.ajaxGET('/clear/' + query, function(err, data) {
                if (err) {
                    self.showAlertErr(err.response);
                    return;
                }
                self.showAlertOK('Cleared cache for ' + query);
            });
        }
    },
    /**
     * Select some random user ID ..yay!
     */
    onFeelingLucky: function() {
        var gid = this.luckyGPlusers[Math.floor(Math.random() * this.luckyGPlusers.length)];
        $('#search').val(gid);
        this.onSearch();
    }
};
