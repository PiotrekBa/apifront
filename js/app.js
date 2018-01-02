$(document).ready(function () {

    //Pobranie danych z endpointu /books
    function getBooks() {
        $.ajax({
            url: "http://localhost:8282/books"
        }).done(function (books) {
            printTitle(books);
            setRemoveLinks();
            getTitleDivs();
        })
    }

    //wypisywanie tytułów książek w wierszach
    function printTitle(books) {
        var bookTitle = $('.book-title');
        books.forEach(function (book) {
            if (book) {
                var row = $('<div class="book" id="' + book.id + '">' +
                    '<div class="head">' +
                    '<div class="title">' + book.title + '</div>' +
                    '<div class="remove">USUŃ</div></div>' +
                    '<div class="description" style="display:none"></div>'
                );
                bookTitle.parent().append(row);
            }
        })
    }

    //Zapisywanie danych do endpointu /books/add
    var button = $('#save');

    button.on('click', function (e) {
        e.preventDefault();
        var title = $('#title').val();
        var author = $('#author').val();
        var isbn = $('#isbn').val();
        var publisher = $('#publisher').val();
        var type = $('#type').val();

        var objToSend = {
            isbn: isbn,
            title: title,
            author: author,
            publisher: publisher,
            type: type
        }

        var myHeaders = new Headers({
            'content-type': 'aplication/json'
        });

        var myInit = {
            method: 'POST',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default',
            body: JSON.stringify(objToSend)
        };

        fetch("http://localhost:8282/books/add", myInit).then(function (response) {
            clearBooks();
            getBooks();
            clearInputs();
        });
    })

    //usuwanie książek z listy
    function setRemoveLinks() {
        var removeLinks = $('div.remove');
        removeLinks.on('click', function (e) {

            e.preventDefault();
            var id = $(e.target).parent().parent().attr('id');
            var myHeaders = new Headers({
                'content-type': 'aplication/json'
            });

            var myInit = {
                method: 'DELETE',
                headers: myHeaders,
                mode: 'cors',
                cache: 'default'
            };

            fetch("http://localhost:8282/books/remove/" + id, myInit).then(function (response) {
                clearBooks();
                getBooks();
            });
        })
    }

    //czyszczenie zestawienia książek
    function clearBooks() {
        var booksTitle = $('.book');
        booksTitle.remove();
    }

    //czyszczenie inputów
    function clearInputs() {
        var inputs = $('input');
        inputs.val("");
    }

    //rozwijanie tytułów
    function getTitleDivs() {
        var titleDivs = $('.title');
        titleDivs.on('click', function (e) {
            var div = $(e.target).parent().parent();
            var id = div.attr('id');
            var myHeaders = new Headers({
                'content-type': 'aplication/json'
            });

            var myInit = {
                method: 'GET',
                headers: myHeaders,
                mode: 'cors',
                cache: 'default'
            };

            fetch("http://localhost:8282/books/" + id, myInit).then(function (response) {
                var url = response.url;
                getOneBook(url, div);
            });
        })
    }
    //pobieranie pojedynczej ksiazki
    function getOneBook(url, div) {
        $.ajax({
            url: url
        }).done(function (book) {
            printDescription(book, div);
        })
    }

    //wypisywanie pojedynczej ksiazki
    function printDescription(book, div) {
        var allDescription = $('.description');
        allDescription.text('');
        description = div.children().next();
        if (description.css('display') === 'inline') {
            description.css('display', 'none');
        } else {
            allDescription.css('display', 'none');
            description.css('display', 'initial');
            var content = $('<div class="content"><span class="bigger">Autor: </span><span>' + book.author + '</span><br>' +
                '<span class="bigger">ISBN: </span><span>' + book.isbn + '</span><br>' +
                '<span class="bigger">Wydawnictwo: </span><span>' + book.publisher + '</span><br>' +
                '<span class="bigger">Rodzaj: </span><span>' + book.type + '</span></div>');
            description.append(content);
        }
    }

    //instrukcje wykonawcze
    getBooks();
})