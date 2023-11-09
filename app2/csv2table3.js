// nova versão 16-10-2023

// var dtTable;

function organizaDados(csvData) {
    // teste para reordenar
    var headers = csvData[0];
    var dataObjects = csvData.slice(1).map(row => {
        var obj = {};
        headers.forEach((header, index) => {
            obj[header] = row[index];
        });
        return obj;
    });
    // cria um novo com outra ordem para exibição //Todo: Otimizar
    var novaTab = [];
    var headers = [
        'id',
        'Comarca',
        'Promotoria de Justiça',
        'Endereço',
        'Sala',
        'Titular',
        'telefones',
        'e-mail',
        'Atribuição',
        'Situação'
    ];
    // troca a ordem
    novaTab.push(headers);
    dataObjects.forEach(function(row) {
        // Por exemplo, para trocar a ordem das colunas '1234' e 'id'
        var novaLinha = headers.map(header => row[header]);
        novaTab.push(novaLinha);
    });
    return (novaTab);
}



function init (options) {
    options = options || {};
    var csv_path = options.csv_path || "";
    var el = options.element || "table-container";
    var allow_download = options.allow_download || false;
    var csv_options = options.csv_options || {};
    var datatables_options = options.datatables_options || {};
    var custom_formatting = options.custom_formatting || [];
    var customTemplates = {};
    $.each(custom_formatting, function (i, v) {
        var colIdx = v[0];
        var func = v[1];
        customTemplates[colIdx] = func;
    });

    var xtbl = "<thead><tr><th></th><th>Comarca</th><th>Endereço</th><th>Titular</th><th>URL</th></tr></thead><tfoot><tr><th></th><th>Comarca</th><th>Endereço</th><th>Titular</th><th>URL</th></tr></tfoot>";
    xtbl = '';
    var $table = $("<table class='table tabdms table-striped table-condensed' id='" + el + "-table'>" + xtbl + " </table>");
    var $containerElement = $("#" + el);
    $containerElement.empty().append($table);

    $.when($.get(csv_path)).then(
        function (data) {
            // var 
            csvData = $.csv.toArrays(data, csv_options);

            tbOriginal = csvData;
            csvOriginal = csvData;

            csvData = organizaDados(csvData);

            var $tableHead = $("<thead></thead>");
            var csvHeaderRow = csvData[0];
            var $tableHeadRow = $("<tr></tr>");
            for (var headerIdx = 0; headerIdx < csvHeaderRow.length; headerIdx++) {
                $tableHeadRow.append($("<th></th>").text(csvHeaderRow[headerIdx]));
            }
            $tableHead.append($tableHeadRow);

            $table.append($tableHead);
            var $tableBody = $("<tbody></tbody>");

            for (var rowIdx = 1; rowIdx < csvData.length; rowIdx++) {
                var $tableBodyRow = $("<tr></tr>");
                for (var colIdx = 0; colIdx < csvData[rowIdx].length; colIdx++) {
                    var $tableBodyRowTd = $("<td></td>");
                    var cellTemplateFunc = customTemplates[colIdx];
                    if (cellTemplateFunc) {
                        $tableBodyRowTd.html(
                            cellTemplateFunc(dados = csvData[rowIdx][colIdx],
                                rowIdx = rowIdx, colIdx=colIdx));
                    } else {
                        $tableBodyRowTd.text(csvData[rowIdx][colIdx]);
                    }
                    $tableBodyRow.append($tableBodyRowTd);
                    $tableBody.append($tableBodyRow);
                }
            };
            $table.append($tableBody);

            dtTable = $table.DataTable(datatables_options);

            if (allow_download) {
                $containerElement.append("<p><a class='btn btn-info' href='" + csv_path + "'><i class='glyphicon glyphicon-download'></i> Download as CSV</a></p>");
            }
            // return (dtTable);      
            console.log('return dtTable when');
            valTable = csvData;
            addClick();
            return (dtTable);           
        });  
    console.log('return dtTable');
};


