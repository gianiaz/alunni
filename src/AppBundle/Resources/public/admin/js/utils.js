window.location.getPositionalUrl = function(zeroIndex) {

    if(typeof(zeroIndex) === 'undefined') {
        zeroIndex = 0;
    }

    var path = window.location.pathname;

    path = trim(path, '/');

    if(!path) {
        return null;
    }

    path = path.split('/');

    if(typeof(path[zeroIndex]) !== 'undefined') {

        return path[zeroIndex];
    }

    return null;
}

function _(string, module) {

    var warn = true;

    if(typeof(Locale) !== 'undefined') {

        if(typeof module === 'undefined' || module === null) {
            module = 'default';
        }

        if(typeof(Locale[module]) !== 'undefined') {
            if(typeof(Locale[module][string]) !== 'undefined') {
                string = Locale[module][string];
                warn = false;
            }
        }

    }

    if(typeof console !== 'undefined' && warn) {
        console.warn(string + ' (' + module + ') non tradotta');
    }

    sprintfArgs = [];
    sprintfArgs.push(string);

    for(var i = 0; i < arguments.length; i++) {
        if(i > 1) {
            sprintfArgs.push(arguments[i]);
        }
    }

    console.log(sprintfArgs);


    return sprintf.apply(null, sprintfArgs);

}

function sprintf() {
    //  discuss at: http://locutus.io/php/sprintf/
    // original by: Ash Searle (http://hexmen.com/blog/)
    // improved by: Michael White (http://getsprink.com)
    // improved by: Jack
    // improved by: Kevin van Zonneveld (http://kvz.io)
    // improved by: Kevin van Zonneveld (http://kvz.io)
    // improved by: Kevin van Zonneveld (http://kvz.io)
    // improved by: Dj
    // improved by: Allidylls
    //    input by: Paulo Freitas
    //    input by: Brett Zamir (http://brett-zamir.me)
    //   example 1: sprintf("%01.2f", 123.1)
    //   returns 1: '123.10'
    //   example 2: sprintf("[%10s]", 'monkey')
    //   returns 2: '[    monkey]'
    //   example 3: sprintf("[%'#10s]", 'monkey')
    //   returns 3: '[####monkey]'
    //   example 4: sprintf("%d", 123456789012345)
    //   returns 4: '123456789012345'
    //   example 5: sprintf('%-03s', 'E')
    //   returns 5: 'E00'

    var regex = /%%|%(\d+\$)?([\-+'#0 ]*)(\*\d+\$|\*|\d+)?(?:\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g
    var a = arguments
    var i = 0
    var format = a[i++]

    var _pad = function(str, len, chr, leftJustify) {
        if(!chr) {
            chr = ' '
        }
        var padding = (str.length >= len) ? '' : new Array(1 + len - str.length >>> 0).join(chr)
        return leftJustify ? str + padding : padding + str
    }

    var justify = function(value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
        var diff = minWidth - value.length
        if(diff > 0) {
            if(leftJustify || !zeroPad) {
                value = _pad(value, minWidth, customPadChar, leftJustify)
            } else {
                value = [
                    value.slice(0, prefix.length),
                    _pad('', diff, '0', true),
                    value.slice(prefix.length)
                ].join('')
            }
        }
        return value
    }

    var _formatBaseX = function(value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
        // Note: casts negative numbers to positive ones
        var number = value >>> 0
        prefix = (prefix && number && {
            '2': '0b',
            '8': '0',
            '16': '0x'
        }[base]) || ''
        value = prefix + _pad(number.toString(base), precision || 0, '0', false)
        return justify(value, prefix, leftJustify, minWidth, zeroPad)
    }

    // _formatString()
    var _formatString = function(value, leftJustify, minWidth, precision, zeroPad, customPadChar) {
        if(precision !== null && precision !== undefined) {
            value = value.slice(0, precision)
        }
        return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar)
    }

    // doFormat()
    var doFormat = function(substring, valueIndex, flags, minWidth, precision, type) {
        var number, prefix, method, textTransform, value

        if(substring === '%%') {
            return '%'
        }

        // parse flags
        var leftJustify = false
        var positivePrefix = ''
        var zeroPad = false
        var prefixBaseX = false
        var customPadChar = ' '
        var flagsl = flags.length
        var j
        for(j = 0; j < flagsl; j++) {
            switch(flags.charAt(j)) {
                case ' ':
                    positivePrefix = ' '
                    break
                case '+':
                    positivePrefix = '+'
                    break
                case '-':
                    leftJustify = true
                    break
                case "'":
                    customPadChar = flags.charAt(j + 1)
                    break
                case '0':
                    zeroPad = true
                    customPadChar = '0'
                    break
                case '#':
                    prefixBaseX = true
                    break
            }
        }

        // parameters may be null, undefined, empty-string or real valued
        // we want to ignore null, undefined and empty-string values
        if(!minWidth) {
            minWidth = 0
        } else if(minWidth === '*') {
            minWidth = +a[i++]
        } else if(minWidth.charAt(0) === '*') {
            minWidth = +a[minWidth.slice(1, -1)]
        } else {
            minWidth = +minWidth
        }

        // Note: undocumented perl feature:
        if(minWidth < 0) {
            minWidth = -minWidth
            leftJustify = true
        }

        if(!isFinite(minWidth)) {
            throw new Error('sprintf: (minimum-)width must be finite')
        }

        if(!precision) {
            precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type === 'd') ? 0 : undefined
        } else if(precision === '*') {
            precision = +a[i++]
        } else if(precision.charAt(0) === '*') {
            precision = +a[precision.slice(1, -1)]
        } else {
            precision = +precision
        }

        // grab value using valueIndex if required?
        value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++]

        switch(type) {
            case 's':
                return _formatString(value + '', leftJustify, minWidth, precision, zeroPad, customPadChar)
            case 'c':
                return _formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad)
            case 'b':
                return _formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad)
            case 'o':
                return _formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad)
            case 'x':
                return _formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad)
            case 'X':
                return _formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad)
                    .toUpperCase()
            case 'u':
                return _formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad)
            case 'i':
            case 'd':
                number = +value || 0
                // Plain Math.round doesn't just truncate
                number = Math.round(number - number % 1)
                prefix = number < 0 ? '-' : positivePrefix
                value = prefix + _pad(String(Math.abs(number)), precision, '0', false)
                return justify(value, prefix, leftJustify, minWidth, zeroPad)
            case 'e':
            case 'E':
            case 'f': // @todo: Should handle locales (as per setlocale)
            case 'F':
            case 'g':
            case 'G':
                number = +value
                prefix = number < 0 ? '-' : positivePrefix
                method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())]
                textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2]
                value = prefix + Math.abs(number)[method](precision)
                return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]()
            default:
                return substring
        }
    }

    return format.replace(regex, doFormat)
}

var HandleBarHelper = {
        cache: {},
        lockScreen: function(options) {

            if(typeof(options) === 'undefined') {
                options = {};
            }

            if(HandleBarHelper.check()) {

                var settings = {
                    'type': 'danger',
                    'message': 'Attendere prego...',
                    'icon': 'fa-spin fa-spinner'
                };

                jQuery.extend(settings, options);

                var id = 'lockScreen';

                var HandleBarCompiled = HandleBarHelper.compile(id);

                var data = {
                    type: settings.type,
                    message: settings.message,
                    icon: settings.icon
                };

                $(HandleBarCompiled(data)).appendTo('body');


            }
        },
        unlockScreen: function() {
            $('#overlay').remove();
        },
        alert: function(options) {

            if(typeof(options) == 'undefined') {
                options = {};
            }

            if(HandleBarHelper.check()) {

                var settings = {
                    'type': 'danger',
                    'titolo': 'Il mio titolo',
                    'content': 'Il mio contenuto',
                    'OK': 'Ok',
                    'callback': null
                };

                jQuery.extend(settings, options);

                var id = 'alertDialog';

                var HandleBarCompiled = HandleBarHelper.compile(id);

                var data = {
                    'type': settings.type,
                    'titolo': settings.titolo,
                    'content': settings.content,
                    'OK': settings.OK
                };

                var $Modal = $(HandleBarCompiled(data));
                $Modal.appendTo('body');

                $Modal.modal();

                $Modal.find('.btn-confirm').on('click', function(e) {
                    e.preventDefault();
                    $Modal.modal('hide');
                });

                $Modal.on('hidden.bs.modal', function(e) {
                    $(this).data('bs.modal', null);
                    $Modal.remove();
                    if(typeof(settings.callback) === 'function') {
                        settings.callback();
                    }
                });
            }

        },
        confirm: function(options) {

            if(typeof(options) === 'undefined') {
                options = {};
            }

            if(HandleBarHelper.check()) {

                var settings = {
                    'type': 'danger',
                    'titolo': 'Il mio titolo',
                    'content': 'Il mio contenuto',
                    'OK': 'Ok',
                    'large': '',
                    'CANCEL': 'Annulla',
                    'onOK': null,
                    'onCANCEL': null,
                    'onShow': null
                };

                jQuery.extend(settings, options);

                if(settings.large) {
                    settings.large = ' modal-xl';
                }

                var id = 'confirmDialog';

                var HandleBarCompiled = HandleBarHelper.compile(id);

                var data = {
                    'type': settings.type,
                    'titolo': settings.titolo,
                    'large': settings.large,
                    'content': settings.content,
                    'CANCEL': settings.CANCEL,
                    'OK': settings.OK
                };

                var $Modal = $(HandleBarCompiled(data));
                $Modal.appendTo('body');

                $Modal.modal();


                $Modal.on('shown.bs.modal', function(e) {
                    if(typeof(settings.onShow) === 'function') {
                        settings.onShow($Modal);
                    }
                });

                $Modal.on('hidden.bs.modal', function(e) {
                    $(this).data('bs.modal', null);
                    $Modal.remove();
                    if(typeof(settings.callback) === 'function') {
                        settings.callback();
                    }
                });

                if(typeof(settings.onOK) === 'function') {
                    $Modal.find('.btn-confirm').on('click', function(e) {
                        e.preventDefault();
                        settings.onOK($Modal);
                    });
                }

                if(typeof(settings.onCANCEL) === 'function') {
                    $Modal.find('.btn-cancel').on('click', function(e) {
                        e.preventDefault();
                        settings.onCANCEL($Modal);
                    });
                } else {
                    $Modal.find('.btn-cancel').on('click', function(e) {
                        e.preventDefault();
                        $Modal.modal('hide');
                    });
                }
            }
        },

        modalForm: function(options) {

            if(typeof(options) === 'undefined') {
                options = {};
            }

            var settings = {
                id: false,
                size: '',
                markup: false, // se c'è l'id viene ignorato, altrimenti viene usato questo da mettere dentro la modale
                title: _('Il mio titolo'),
                data: {},
                onShow: null,
                onOk: null,
                onCancel: null,
                cancelLbl: _('Annula'),
                okLbl: _('Ok'),
                modalOptions: {
                    backdrop: 'static',
                    keyboard: false
                },
                parentElement: 'body'
            };

            jQuery.extend(settings, options);

            if(HandleBarHelper.check()) {

                var form = false;

                if(settings.id) {

                    form = HandleBarHelper.compile(settings.id);

                    form = form(settings.data);

                } else if(settings.markup) {

                    form = settings.markup;

                }

                if(form) {

                    var templateData = {
                        'id': settings.id + 'Modal',
                        'size': settings.size,
                        'title': settings.title,
                        'content': form,
                        'CANCEL': settings.cancelLbl,
                        'OK': settings.okLbl
                    };

                    console.log(HandleBarHelper.cache);

                    HandleBarHelper.compile('//admin/js/handlebars/modal.jstpl', function(compiled) {

                        var $Modal = $(compiled(templateData)).modal(settings.modalOptions);

                        $Modal.on('shown.bs.modal', function(e) {
                            if(typeof(settings.onShow) === 'function') {
                                settings.onShow($Modal);
                            }
                        });

                        $Modal.on('hidden.bs.modal', function(e) {
                            if(typeof(settings.onCancel) === 'function') {
                                settings.onCancel($Modal);
                            }
                            $(this).data('bs.modal', null);
                            $Modal.remove();
                        });

                        $Modal.find('.btn-ok').on('click', function(e) {
                            if(typeof settings.onOk === 'function') {
                                settings.onOk($Modal);
                            } else {
                                $Modal.modal('hide');
                            }

                        });

                    });

                }

            }

        },
        modal: function(options) {

            if(typeof(options) === 'undefined') {
                options = {};
            }

            var settings = {
                id: false,
                data: {},
                callback: null,
                onShow: null,
                modalOptions: {
                    backdrop: 'static',
                    keyboard: false
                },
                parentElement: 'body'
            };

            jQuery.extend(settings, options);

            if(HandleBarHelper.check()) {

                if(settings.id) {

                    var HandleBarCompiled = HandleBarHelper.compile(settings.id);

                    var $Modal = $(HandleBarCompiled(settings.data));
                    $Modal.appendTo(settings.parentElement);

                    $Modal.modal(settings.modalOptions);

                    $Modal.on('shown.bs.modal', function(e) {
                        if(typeof(settings.onShow) === 'function') {
                            settings.onShow($Modal);
                        }
                    });


                    $Modal.on('hidden.bs.modal', function(e) {
                        $(this).data('bs.modal', null);
                        $Modal.remove();
                        if(typeof(settings.callback) === 'function') {
                            settings.callback();
                        }
                    });


                } else {
                    console.error(_('Devi passare un id da cui prelevare il markup'));
                }

            }


        }
        ,
        check: function() {
            if(typeof(Handlebars) === 'undefined') {
                console.error(_('Devi includere Handlerbars'));
                return false;
            }
            return true;
        }
        ,
        compile: function(id, callback) {
            if(typeof(HandleBarHelper.cache[id]) === 'undefined') {
                if(id.indexOf('//') === 0) {
                    if(typeof(callback) === 'undefined') {
                        console.error(_('Senza callback non posso ritornare un template caricato via http'));
                    } else {
                        HandleBarHelper.getMarkup(id, function(templateMarkup) {
                            HandleBarHelper.cache[id] = Handlebars.compile(templateMarkup);
                            callback(HandleBarHelper.cache[id]);
                        });
                    }
                } else {
                    var templateMarkup = HandleBarHelper.loadMarkup(id);
                    if(templateMarkup) {
                        HandleBarHelper.cache[id] = Handlebars.compile(templateMarkup);
                        return HandleBarHelper.cache[id];
                    }
                }
            } else {
                if(typeof(callback) === 'undefined') {
                    return HandleBarHelper.cache[id];
                } else {
                    callback(HandleBarHelper.cache[id]);
                }
            }
        }
        ,
        loadMarkup: function(id) {
            if($('#' + id + 'Template').length > 0) {
                html = $('#' + id + 'Template').html();
                return html;
            } else {
                console.error(_('Non trovo il blocco con id %s', '#' + id + 'Template'));
                return false;
            }
        }
        ,
        getMarkup: function(id, cb) {
            id = id.replace('//', '//' + location.host + '/');
            $.get({
                'url': id,
                'success': function(data) {
                    cb(data);
                }
            });

        }

    }
;


function trim(str, charlist) {
    //  discuss at: http://locutus.io/php/trim/
    // original by: Kevin van Zonneveld (http://kvz.io)
    // improved by: mdsjack (http://www.mdsjack.bo.it)
    // improved by: Alexander Ermolaev (http://snippets.dzone.com/user/AlexanderErmolaev)
    // improved by: Kevin van Zonneveld (http://kvz.io)
    // improved by: Steven Levithan (http://blog.stevenlevithan.com)
    // improved by: Jack
    //    input by: Erkekjetter
    //    input by: DxGx
    // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
    //   example 1: trim('    Kevin van Zonneveld    ')
    //   returns 1: 'Kevin van Zonneveld'
    //   example 2: trim('Hello World', 'Hdle')
    //   returns 2: 'o Wor'
    //   example 3: trim(16, 1)
    //   returns 3: '6'
    var whitespace = [
        ' ',
        '\n',
        '\r',
        '\t',
        '\f',
        '\x0b',
        '\xa0',
        '\u2000',
        '\u2001',
        '\u2002',
        '\u2003',
        '\u2004',
        '\u2005',
        '\u2006',
        '\u2007',
        '\u2008',
        '\u2009',
        '\u200a',
        '\u200b',
        '\u2028',
        '\u2029',
        '\u3000'
    ].join('')
    var l = 0
    var i = 0
    str += ''
    if(charlist) {
        whitespace = (charlist + '').replace(/([[\]().?/*{}+$^:])/g, '$1')
    }
    l = str.length
    for(i = 0; i < l; i++) {
        if(whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(i)
            break
        }
    }
    l = str.length
    for(i = l - 1; i >= 0; i--) {
        if(whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(0, i + 1)
            break
        }
    }
    return whitespace.indexOf(str.charAt(0)) === -1 ? str : ''
}

function number_format(number, decimals, decPoint, thousandsSep) { // eslint-disable-line camelcase
    //  discuss at: http://locutus.io/php/number_format/
    // original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // improved by: Kevin van Zonneveld (http://kvz.io)
    // improved by: davook
    // improved by: Brett Zamir (http://brett-zamir.me)
    // improved by: Brett Zamir (http://brett-zamir.me)
    // improved by: Theriault (https://github.com/Theriault)
    // improved by: Kevin van Zonneveld (http://kvz.io)
    // bugfixed by: Michael White (http://getsprink.com)
    // bugfixed by: Benjamin Lupton
    // bugfixed by: Allan Jensen (http://www.winternet.no)
    // bugfixed by: Howard Yeend
    // bugfixed by: Diogo Resende
    // bugfixed by: Rival
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    //  revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    //  revised by: Luke Smith (http://lucassmith.name)
    //    input by: Kheang Hok Chin (http://www.distantia.ca/)
    //    input by: Jay Klehr
    //    input by: Amir Habibi (http://www.residence-mixte.com/)
    //    input by: Amirouche
    //   example 1: number_format(1234.56)
    //   returns 1: '1,235'
    //   example 2: number_format(1234.56, 2, ',', ' ')
    //   returns 2: '1 234,56'
    //   example 3: number_format(1234.5678, 2, '.', '')
    //   returns 3: '1234.57'
    //   example 4: number_format(67, 2, ',', '.')
    //   returns 4: '67,00'
    //   example 5: number_format(1000)
    //   returns 5: '1,000'
    //   example 6: number_format(67.311, 2)
    //   returns 6: '67.31'
    //   example 7: number_format(1000.55, 1)
    //   returns 7: '1,000.6'
    //   example 8: number_format(67000, 5, ',', '.')
    //   returns 8: '67.000,00000'
    //   example 9: number_format(0.9, 0)
    //   returns 9: '1'
    //  example 10: number_format('1.20', 2)
    //  returns 10: '1.20'
    //  example 11: number_format('1.20', 4)
    //  returns 11: '1.2000'
    //  example 12: number_format('1.2000', 3)
    //  returns 12: '1.200'
    //  example 13: number_format('1 000,50', 2, '.', ' ')
    //  returns 13: '100 050.00'
    //  example 14: number_format(1e-8, 8, '.', '')
    //  returns 14: '0.00000001'
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '')
    var n = !isFinite(+number) ? 0 : +number
    var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
    var sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
    var dec = (typeof decPoint === 'undefined') ? '.' : decPoint
    var s = ''
    var toFixedFix = function(n, prec) {
        var k = Math.pow(10, prec)
        return '' + (Math.round(n * k) / k)
            .toFixed(prec)
    }
    // @todo: for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
    if(s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
    }
    if((s[1] || '').length < prec) {
        s[1] = s[1] || ''
        s[1] += new Array(prec - s[1].length + 1).join('0')
    }
    return s.join(dec)
}