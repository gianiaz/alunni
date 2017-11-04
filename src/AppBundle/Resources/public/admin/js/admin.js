$(function() {

    var $body = $('body');

    $(document).on('click', '#about', function(e) {
        e.preventDefault();

        var opts = {
            'type': 'danger',
            'titolo': 'Hire me!',
            'content': 'Looking for an experienced Fullstack developer?<br />Visit my linkedin profile at <a href="https://www.linkedin.com/in/gianiaz/">https://www.linkedin.com/in/gianiaz/</a>',
            'OK': 'Ok',
            'callback': null
        };
        HandleBarHelper.alert(opts);

    });

    /** Click sul bottone di cancellazione nelle liste di elementi **/
    $(document).on('click', '.btn-delete', function(e) {

        e.preventDefault();

        var title = $(this).data('title');
        var href = $(this).attr('href');

        var question = _('Vuoi davvero eliminare l\'elemento "%s"?', 'default', title);

        var opts = {
            'type': 'danger',
            'titolo': _('Conferma cancellazione'),
            'content': question,
            'OK': 'Ok',
            'CANCEL': 'Annulla',
            'onOK': function($modal) {
                $modal.modal('hide');
                window.location.assign(href);
            }
        };
        HandleBarHelper.confirm(opts);
    });

});