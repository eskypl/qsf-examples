$(function () {
    var $qsf = $('#flights-qsf');
    var $ot = $('[name="ot"]', $qsf);
    var $tr = $('.leg', $qsf);
    var $trFirst = $tr.filter(':first');
    var $trRest = $tr.not($trFirst);
    var $arrival = $trFirst.find('.arrival');

    var rtDestinationsMatrix = {
        'tr[0][d]': 'tr[1][a]',
        'tr[0][a]': 'tr[1][d]'
    };

    function hide($element) {
        return $element
            .addClass('hidden')
            .find('input')
            .removeAttr('required');
    }

    function show($element) {
        return $element
            .removeClass('hidden')
            .find('input')
            .attr('required', 'required');
    }

    function changeLayout() {
        switch ($ot.filter(':checked').val()) {
            case 'OneWay':
                [$trRest, $arrival].map(hide);
                break;
            case 'RoundTrip':
                hide($trRest);
                show($arrival);
                break;
            case 'MultiCity':
                hide($arrival);
                show($trRest);
                break;
        }
    }

    $ot.on('change', changeLayout);

    $tr.filter(':first').on('change', '[name$="[a]"],[name$="[d]"]', function () {
        if ($ot.filter(':checked').val() === 'RoundTrip') {
            $('[name="' + rtDestinationsMatrix[this.name] + '"]').val(this.value);
        }
    });

    changeLayout();
}());
