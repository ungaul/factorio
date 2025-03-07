$(document).ready(function() {
    setTimeout(function() {
        var $list = $('.leaflet-control-layers-list');
        var $platformsContainer = $('<div id="platforms"><div class="platform-content"></div></div>');
        var $planetsContainer = $('<div id="planets"><div class="planets-content"></div></div>');
        var $layersContainer = $('<div id="layers"></div>');

        $list.prepend($layersContainer, $platformsContainer, $planetsContainer);

        var $platformsContent = $platformsContainer.find('.platform-content');
        var $planetsContent = $planetsContainer.find('.planets-content');

        $('.leaflet-control-layers-list label').each(function() {
            var $label = $(this);
            var $span = $label.find('span');
            var $checkbox = $label.find('input[type="checkbox"]');

            if ($checkbox.length) {
                $layersContainer.append($label);
            } else if ($span.length) {
                if ($span.text().toLowerCase().includes('platform')) {
                    $label.addClass('platform');
                    $platformsContent.append($label);
                } else {
                    $label.addClass('planets');
                    $planetsContent.append($label);
                }
            }
        });

        $('.leaflet-tooltip').each(function() {
            var text = $(this).html();
            var updatedText = text
                .replace(/\[item=(.*?)\]/g, '<img class="icon" src="assets/icons/$1.png" alt="$1">')
                .replace(/\[fluid=(.*?)\]/g, '<img class="icon" src="assets/icons/$1.png" alt="$1">');
            $(this).html(updatedText);
        });

        var iconMapping = {
            "Train stations": "assets/station.png",
            "Tags": "assets/tag.png",
            "Debug": "assets/debug.png"
        };

        $('#layers label').each(function() {
            var $label = $(this);
            var $span = $label.find('span');
            var $checkbox = $label.find('input[type="checkbox"]');

            if ($checkbox.length && $span.length) {
                var labelText = $span.text().trim();
                var iconUrl = iconMapping[labelText] || "assets/station.png";

                var $button = $('<button class="layer-toggle"></button>');
                var $icon = $('<img class="layer-icon" src="' + iconUrl + '" alt="' + labelText + '">');

                $button.append($icon).append(" ").append(labelText);
                $button.toggleClass('active', $checkbox.prop('checked'));

                $button.append($checkbox);

                $label.replaceWith($button);
            }
        });
    }, 500);
});
