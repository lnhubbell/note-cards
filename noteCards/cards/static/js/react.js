/** @jsx React.DOM */

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

// $("body").bind("ajaxSend", function(elm, xhr, s){
//    if (s.type == "POST") {
//       xhr.setRequestHeader('X-CSRF-Token', csrf_token);
//    }
// });

$.ajaxPrefilter(function(options, originalOptions, jqXHR){
    if (options['type'].toLowerCase() === "post") {
        jqXHR.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
    } else if (options['type'].toLowerCase() === "patch") {
        jqXHR.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
    }
});

var Card = React.createClass({

  getInitialState: function(){
      return { active: false };
  },

  clickHandler: function (){
      // var active = true;
      var active = !this.state.active;

      this.setState({ active: active });

  },

  render: function() {
    var cx = React.addons.classSet;
    var correctSquareArray = [];
    var correct = Number(this.props.correct);
    for(var i = 0; i < correct; i++) {
    correctSquareArray.push(1);
    }

    var incorrectSquareArray = [];
    var incorrect = Number(this.props.incorrect);
    for(var i = 0; i < incorrect; i++) {
    incorrectSquareArray.push(1);
    }
    var classes = cx({
      'noselect': true,
      'front_side': !this.state.active,
      'back_side': this.state.active,
      'left': true,
    });
    var back_classes = cx({
      'noselect': true,
      'front_side': this.state.active,
      'back_side': !this.state.active,
      'right': true,
    });

    var correctSquares = correctSquareArray.map(function () {
      return (
        <div className="correctSquare">
        </div>
      );
    });

    var incorrectSquares = incorrectSquareArray.map(function () {
      return (
        <div className="incorrectSquare">
        </div>
      );
    });

    return (
      <div className="card well">
        <h3 className="cardAuthor">
          {this.props.title}
        </h3>
        <div className="row">
          <div className="sides col-md-3">
            <div className={classes} onClick={this.clickHandler}>{this.props.front_side}</div>
            <div className={back_classes} onClick={this.clickHandler}>{this.props.back_side}</div>
          </div>
          <div className="col-md-6">
            <div className="row squareBox">
              {correctSquares}
            </div>
            <div className="row squareBox">
              {incorrectSquares}
            </div>
          </div>
        </div>
      </div>

    );
  }
});



var CardForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var title = this.refs.title.getDOMNode().value.trim();
    var front_side = this.refs.front_side.getDOMNode().value.trim();
    var back_side = this.refs.back_side.getDOMNode().value.trim();
    var url = "/cards/?format=json";
    if (!title || !front_side || !back_side) {
      return;
    }
    this.props.onCardSubmit({
        title: title, front_side: front_side, back_side: back_side}, "POST", url);
    this.refs.title.getDOMNode().value = '';
    this.refs.front_side.getDOMNode().value = '';
    this.refs.back_side.getDOMNode().value = '';
    return;
  },
  render: function() {
    return (
      <div className="row noteCard">
      <form className="cardForm well" onSubmit={this.handleSubmit}>
        <div className="row">
          <input className="inputTitle" type="textarea" placeholder="Title" ref="title" />
        </div>
        <div className="row">
          <textarea className="inputSide inputFront" rows="5" placeholder="Front side..." ref="front_side" />
          <textarea className="inputSide" type="text" rows="5" placeholder="Back side..." ref="back_side" />
        </div>
        <input className="right createBtn" type="submit" value="Create" />
      </form>
      </div>
    );
  }
});

var cardSubmit = function(card, type, url) {
  card.CSRF = csrftoken;
  $.ajax({
    url: url,
    // url: "/cards/update/1",
    dataType: 'json',
    type: type,
    data: card ,
    success: function(data) {
      this.setState({data: data});
    }.bind(this),
    error: function(xhr, status, err) {
      console.error(this.props.url, status, err.toString());
    }.bind(this)
  });
}

// tutorial10.js
var CardList = React.createClass({
  handleButtonSubmit: cardSubmit,
  getInitialState: function() {
    return {data: []};
  },
  render: function() {
    var cardNodes = this.props.data.map(function (card) {
      return (
        <div className="cardHolder">
          <Card incorrect={card.incorrect} correct={card.correct} title={card.title} front_side={card.front_side} back_side={card.back_side}>
          </Card>
          <ResponseButtons title={card.title} onButtonSubmit={this.handleButtonSubmit} previous_correct={card.correct} previous_incorrect={card.incorrect} url="/cards/update/1" />
        </div>
      );
    }, this);
    return (
      <div className="cardList">
        {cardNodes}
      </div>
    );
  }
});


var ResponseButtons = React.createClass({
  handleCorrect: function(e) {
    e.preventDefault();
    var correct = this.props.previous_correct + 1;
    var url = "/cards/update/" + this.props.title;
    this.props.onButtonSubmit({
        correct: correct}, "PATCH", url);
    return;
  },
  handleIncorrect: function(e) {
    e.preventDefault();
    var incorrect = this.props.previous_incorrect + 1;
    var url = "/cards/update/" + this.props.title;
    this.props.onButtonSubmit({
        incorrect: incorrect}, "PATCH", url);
    return;
  },
  render: function() {
    return (
      <div className="buttons right">
        <input className="correctBtn" type="submit" value="Correct" onClick={this.handleCorrect} />
        <input className="incorrectBtn" type="submit" value="Incorrect" onClick={this.handleIncorrect} />
      </div>
    );
  }
});






// tutorial17.js
var CardBox = React.createClass({
  loadCardsFromServer: function() {
    $.ajax({
      url: "/cards/?format=json",
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCardSubmit: cardSubmit,
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCardsFromServer();
    setInterval(this.loadCardsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="cardContainer">
        <h2>Create</h2>
        <CardForm onCardSubmit={this.handleCardSubmit} />
        <h2>Cards</h2>
        <CardList url="/cards/update/1" data={this.state.data} />
      </div>
    );
  }
});


React.renderComponent(
  <CardBox url="/cards/?format=json" pollInterval={100} />,
  document.getElementById('content')
);
