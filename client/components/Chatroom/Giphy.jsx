import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  fetchGiphy,
  handleToggleEmoji,
  handleToggleGiphy,
  sendMessage,
} from '../../actions';

class Giphy extends Component {
  constructor() {
    super();

    this.state = { giphySelected: null, giphySearch: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleGiphySelect = this.handleGiphySelect.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleGiphySelect(e) {
    const { username, avatar } = this.props.user;
    const date = new Date();
    const imageMsg = e.target.value || '';

    if (imageMsg) {
      this.setState({ giphySelected: imageMsg });
      this.props.sendMessage({
        username,
        userAvatar: avatar,
        date,
        imageMsg,
        text: '',
      });
      this.props.handleToggleGiphy(false);
    }
  }

  handleChange(e) {
    const giphySearch = e.target.value || '';

    this.setState({ giphySearch });
  }

  handleClick(e) {
    e.preventDefault();

    if (this.props.toggleGiphy) {
      this.props.handleToggleGiphy(false);
    } else {
      this.props.handleToggleGiphy(true);
      this.props.handleToggleEmoji(false);
    }
  }

  handleSearch(e) {
    e.preventDefault();
    const { giphySearch } = this.state;
    this.props.fetchGiphy(giphySearch);
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleSearch(e);
    }
  }

  renderGiphy(giphy) {
    return giphy.map((gif) => {
      const { id, images } = gif;

      return (
        <label key={id} htmlFor={id} className="giphy__list--single">
          <input
            id={id}
            type="radio"
            className="giphy__radioInput"
            value={images.fixed_height_small.url}
            checked={this.state.giphySelected === id}
          />
          <img src={images.fixed_height_small.url} alt={id} />
        </label>
      );
    });
  }

  render() {
    const { giphy, toggleGiphy } = this.props;

    return (
      <div className="giphy">
        <button onClick={this.handleClick} className="giphy__btn">
          <i className="far fa-hand-peace" />
        </button>
        {toggleGiphy && (
          <div className="giphy--active">
            <div className="giphy__search">
              <input
                type="text"
                onChange={this.handleChange}
                className="giphy_search--input"
                placeholder="find your giphy.."
                onKeyPress={this.handleKeyPress}
              />
              <button
                onClick={this.handleSearch}
                className="giphy__search--btn"
                disabled={this.state.giphySearch.length < 1}
              >
                Search
              </button>
            </div>

            <div
              className="giphy__list"
              onChange={this.handleGiphySelect}
            >
              {this.renderGiphy(giphy)}
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  giphy: state.giphy,
  toggleGiphy: state.toggleGiphy,
  user: state.user,
});

Giphy.propTypes = {
  fetchGiphy: PropTypes.func.isRequired,
  giphy: PropTypes.array.isRequired,
  handleToggleEmoji: PropTypes.func.isRequired,
  handleToggleGiphy: PropTypes.func.isRequired,
  sendMessage: PropTypes.func.isRequired,
  toggleGiphy: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, {
  fetchGiphy,
  handleToggleEmoji,
  handleToggleGiphy,
  sendMessage,
})(Giphy);
