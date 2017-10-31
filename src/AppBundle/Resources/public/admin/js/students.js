$(function() {

    var section = window.location.getPositionalUrl(1);

    switch(section) {

        case 'new':
        case 'edit':

            $('.row-vote input[type="number"]').on('change', function() {
                $('.btn-submit-mail').removeClass('disabled');

            });

            $('#addVote').on('click', function(e) {
                e.preventDefault();
                var markup = $('.collection').data('prototype');
                $('.btn-submit-mail').removeClass('disabled');
                var index = $('.row-vote').length;
                var canAdd = true;
                $('.row-vote').each(function() {
                    if($.trim($(this).find('input').val()) == '') {
                        canAdd = false;
                    }
                });
                if(canAdd) {
                    markup = markup.replace(/__name__/g, index);
                    $(markup).insertBefore($(this));
                } else {
                    var opts = {
                        'type': 'danger',
                        'titolo': _('Attenzione'),
                        'content': _('Compila il voto precendete prima di aggiungerne un altro'),
                        'OK': 'Ok',
                        'callback': null
                    };
                    HandleBarHelper.alert(opts);

                }

            });
            break;

        case null:

            /** Datatable della pagina di elenco */
            var cols = [];

            var col = {
                'title': _('Modifica'),
                'className': 'dt0 dt-body-center',
                'searchable': false
            };
            cols.push(col);

            col = {
                'title': _('Nome'),
                'className': 'dt2',
                searchable: true,
                data: 'name'
            };

            cols.push(col);

            col = {
                'title': _('Surname'),
                'className': 'dt2',
                searchable: true,
                data: 'surname'
            };

            cols.push(col);

            col = {
                'title': _('Email'),
                'className': 'dt2',
                searchable: true,
                data: 'email'
            };

            cols.push(col);

            col = {
                'title': _('Media'),
                'className': 'dt2',
                searchable: true,
                data: 'avg'
            };

            cols.push(col);

            col = {};

            cols.push(col);

            var columnDefs = [];

            var columnDef = {
                targets: 0,
                searchable: false,
                orderable: false,
                className: 'dt-body-center',
                render: function(data, type, full, meta) {
                    var toString = full.name + ' ' + full.surname;
                    return '<a href="/students/edit/' + full.id + '" title="' + _('Modifica record:') + toString + '" class="btn btn-xs btn-primary edit"><i class="fa fa-pencil"></i></a>';
                }
            };

            columnDefs.push(columnDef);

            columnDef = {
                targets: cols.length - 1,
                searchable: false,
                className: 'dt-body-center',
                orderable: false,
                render: function(data, type, full, meta) {
                    var toString = full.name + ' ' + full.surname;
                    var title = _('Elimina: ');
                    var ret = '<a href="/students/delete/' + full.id + '" class="btn btn-danger btn-xs btn-delete';
                    ret += '" title="' + title + toString + '" data-title="' + toString + '"><i class="fa fa-trash"></i></a>';
                    return ret;
                }
            };

            columnDefs.push(columnDef);


            $('#datatable').dataTable({
                ajax: {
                    "url": "/students/json"
                },
                stateSave: true,
                iDisplayLength: 15,
                columns: cols,
                columnDefs: columnDefs
            });

            break;

    }

})
;
