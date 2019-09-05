import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
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
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: false,
    refreshing: false,
    page: 1,
  };

  componentDidMount(): void {
    this.getStarred();
  }

  getStarred = async (page = 1) => {
    this.setState({ loading: true });
    const { navigation } = this.props;
    const { stars } = this.state;
    const user = navigation.getParam('user');
    const response = await api.get(`/users/${user.login}/starred`, {
      params: { page },
    });
    const arr = stars;
    response.data.map(item => arr.push(item));
    this.setState({ stars: arr, loading: false, page, refreshing: false });
  };

  loadMore = () => {
    const { page } = this.state;
    const nextPage = page + 1;
    this.getStarred(nextPage);
  };

  reset = () => {
    this.setState({ stars: [], page: 1, refreshing: true }, this.getStarred);
  };

  openRepo = item => {
    const { navigation } = this.props;
    navigation.navigate('Repository', { item });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, page, refreshing } = this.state;
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

        {!refreshing && page === 1 ? spinner : null}

        <Stars
          onEndReachedThreshold={0.2}
          onEndReached={this.loadMore}
          onRefresh={this.reset}
          refreshing={refreshing}
          data={stars}
          keyExtractor={star => String(star.id)}
          renderItem={({ item }) => (
            <Starred onPress={() => this.openRepo(item)}>
              <OnwerAvatar source={{ uri: item.owner.avatar_url }} />
              <Info>
                <Title>{item.name}</Title>
                <Author>{item.owner.login}</Author>
              </Info>
            </Starred>
          )}
        />

        {!refreshing && page !== 1 ? spinner : null}
      </Container>
    );
  }
}
