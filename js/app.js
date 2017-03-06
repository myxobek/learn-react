window.ee = new EventEmitter();

let my_news = [
    {
        author: 'Саша Печкин',
        text: 'В четчерг, четвертого числа...',
        bigText: 'в четыре с четвертью часа четыре чёрненьких чумазеньких чертёнка чертили чёрными чернилами чертёж.'
    },
    {
        author: 'Просто Вася',
        text: 'Считаю, что $ должен стоить 35 рублей!',
        bigText: 'А евро 42!'
    },
    {
        author: 'Гость',
        text: 'Бесплатно. Скачать. Лучший сайт - http://localhost:3000',
        bigText: 'На самом деле платно, просто нужно прочитать очень длинное лицензионное соглашение'
    }
];

let Article = React.createClass({
    propTypes: {
        data: React.PropTypes.shape({
            author: React.PropTypes.string.isRequired,
            text: React.PropTypes.string.isRequired,
            bigText: React.PropTypes.string.isRequired
        })
    },
    getInitialState: function(){
        return {
            visible: false
        }
    },
    readmoreClick: function(e){
        e.preventDefault();
        this.setState({visible: true});
    },
    render: function() {
        let author  = this.props.data.author,
            text    = this.props.data.text,
            bigText = this.props.data.bigText,
            visible = this.state.visible; // считываем значение переменной из состояния компонента

        return (
            <div className="article">
                <p className="news__author">{author}:</p>
                <p className="news__text">{text}</p>

                {/* для ссылки readmore: не показывай ссылку, если visible === true */}
                <a href="#"
                    onClick={this.readmoreClick}
                    className={'news__readmore ' + (visible ? 'none': '')}>
                    Подробнее
                </a>

                {/* для большого текста: не показывай текст, если visible === false */}
                <p className={'news__big-text ' + (visible ? '': 'none')}>{bigText}</p>
            </div>
        );
    }
});

let News = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired
    },
    getInitialState: function(){
        return {
            counter: 0
        }
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
                <strong
                    className={'news_count ' + data.length > 0 ? '' : 'none'}>
                    Всего новостей: {data.length}
                </strong>
            </div>
        );
    }
});

let Add = React.createClass({
    componentDidMount: function(e) {
        ReactDOM.findDOMNode(this.refs.author).focus();
        ReactDOM.findDOMNode(this.refs.alert_button).disabled = true;
    },
    onBtnClickHandler: function(e) {
        e.preventDefault();
        let author = ReactDOM.findDOMNode(this.refs.author).value;
        let textEl = ReactDOM.findDOMNode(this.refs.text);

        let item = [{
            author: author,
            text: textEl.value,
            bigText: '...'
        }];

        window.ee.emit('News.add', item);

        textEl.value = '';
        this.setState({textIsFilled: ''});
    },
    onCheckRuleClick: function(e) {
        this.setState({ agreeIsChecked: e.target.checked });
    },
    onFieldChange: function(fieldName, e) {
        let next = {};
        next[fieldName] = ( e.target.value.trim().length > 0 );
        this.setState(next);
    },
    getInitialState: function() {
        return {
            agreeIsChecked: false,
            authorIsFilled: false,
            textIsFilled: false
        }
    },
    render: function() {
        let agreeIsChecked  = this.state.agreeIsChecked;
        let authorIsFilled  = this.state.authorIsFilled;
        let textIsFilled    = this.state.textIsFilled;
        return (
            <form className="add cf">
                <input
                    type="text"
                    className="add__author"
                    defaultValue=""
                    placeholder="Ваше имя"
                    ref="author"
                    onChange={this.onFieldChange.bind(this, 'authorIsFilled')}
                />
                <textarea
                    className="add__text"
                    defaultValue=""
                    placeholder="Текст новости"
                    ref="text"
                    onChange={this.onFieldChange.bind(this, 'textIsFilled')}
                />
                <label className="add__checkrule">
                    <input type="checkbox" defaultChecked={false} ref="checkrule" onChange={this.onCheckRuleClick}/>Я согласен с правилами
                </label>
                <button
                    className="add__btn"
                    onClick={this.onBtnClickHandler}
                    ref="alert_button"
                    disabled={!(agreeIsChecked && authorIsFilled && textIsFilled)}>
                    Показать новость
                </button>
            </form>
        )
    }
});

let App = React.createClass({
    getInitialState: function() {
        return {
            news: my_news
        }
    },
    componentDidMount: function() {
        let self = this;
        window.ee.addListener('News.add', function(item) {
            let nextNews = item.concat(self.state.news);
            self.setState({news: nextNews});
        });
    },
    componentWillUmount: function() {
        window.ee.removeListener('News.add');
    },
    render: function() {
        return (
            <div className="app">
                <h3>Новости</h3>
                <Add/>
                <News data={this.state.news} />
            </div>
        );
    }
});

ReactDOM.render(
    <App />,
    document.getElementById('root')
);