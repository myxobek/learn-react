console.log( React );
console.log( ReactDOM );

let my_news = [
    {
        author: 'Саша Печкин',
        text: 'В четверг, четвертого числа...'
    },
    {
        author: 'Просто Вася',
        text: 'Считаю, что $ должен стоить 35 рублей!'
    },
    {
        author: 'Гость',
        text: 'Бесплатно. Скачать. Лучший сайт - http://localhost:3000'
    }
];

let Article = React.createClass({
    propTypes: {
        data: React.PropTypes.shape({
            author: React.PropTypes.string.isRequired,
            text: React.PropTypes.string.isRequired
        })
    },
    render: function() {
        let author  = this.props.data.author;
        let text    = this.props.data.text;

        return (
            <div className="article">
                <p className="news__author">{author}:</p>
                <p className="news__text">{text}</p>
            </div>
        );
    }
});

let News = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired
    },
    render: function() {
        let data = this.props.data;
        let newsTemplate;

        if ( data.length > 0 )
        {
            newsTemplate = data.map( (item, index) => {
                return (
                    <div key={index}>
                        <Article data={item} />
                    </div>
                )
            });
        }
        else
        {
            newsTemplate = <p>К сожалению новостей нет</p>
        }

        return (
            <div className="news">
                {newsTemplate}
                <strong className={'news_count ' + data.length > 0 ? '' : 'none'}>Всего новостей: {data.length}</strong>
            </div>
        );
    }
});

let App = React.createClass({
    render: function() {
        return (
            <div className="app">
                <h3>Новости</h3>
                <News data={my_news} />
            </div>
        );
    }
});

ReactDOM.render(
    <App />,
    document.getElementById('root')
);