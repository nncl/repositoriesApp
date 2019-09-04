import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Bio,
  Name,
  Stars,
  Starred,
  OnwerAvatar,
  Info,
  Title,
  Author,
  Spacer,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: false,
    page: 1,
    hasMore: true,
  };

  componentDidMount(): void {
    this.getStarred();
  }

  getStarred = async () => {
    this.setState({ loading: true });
    const { navigation } = this.props;
    const { page, stars } = this.state;
    const user = navigation.getParam('user');
    const response = await api.get(`/users/${user.login}/starred`, {
      params: { page },
    });
    const arr = stars;
    response.data.map(item => arr.push(item));
    this.setState({ stars: arr, loading: false });
  };

  loadMore = () => {
    const { page } = this.state;
    this.setState({ page: page + 1 });
    this.getStarred();
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, page } = this.state;
    const user = navigation.getParam('user');
    const spinner = loading ? (
      <Spacer>
        <ActivityIndicator color="#915c91" />
      </Spacer>
    ) : null;

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {page === 1 ? spinner : null}

        <Stars
          onEndReachedThreshold={0.2}
          onEndReached={this.loadMore}
          data={stars}
          keyExtractor={star => String(star.id)}
          renderItem={({ item }) => (
            <Starred>
              <OnwerAvatar source={{ uri: item.owner.avatar_url }} />
              <Info>
                <Title>{item.id}</Title>
                <Author>{item.owner.login}</Author>
              </Info>
            </Starred>
          )}
        />

        {page !== 1 ? spinner : null}
      </Container>
    );
  }
}
