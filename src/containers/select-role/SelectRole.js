import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  Container,
  Row
} from 'reactstrap';
import {Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';
import {fetchSelectRole} from '../../actions/select-role';
import {ComponentWithError} from '../components/ComponentWithError';
import {RenderIfLoaded} from '../components/RenderIfLoaded';
import {ListGroup} from 'reactstrap';
import styled from 'styled-components';
import {Role} from './Role';
import {Logo} from '../components/Logo';
import {
  RoundedContent,
  RoundedWrapper,
} from '../../constants/styles';

const SelectRoleHeader = styled.h4`
  margin-top: 15px;
  padding-top: 15px;
`;

class SelectRole extends Component {
  static propTypes = {
    roles: PropTypes.array,
    status: PropTypes.string,
    errorMessage: PropTypes.string,
  };

  state = {
    loaded: false,
  };

  displayAccountId = true;

  async componentDidMount() {
    this._isMounted = true;

    await this.props.fetchSelectRole();

    let uniqueAccountIds = new Set(this.props.roles.map(role => {return role.accountId;}));
    if (uniqueAccountIds.size === 1) {
      this.displayAccountId = false;
    }

    if (this._isMounted) {
      this.setState({
        loaded: true,
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const {
      errorMessage,
      status,
      roles,
    } = this.props;

    if (status === 'selected') {
      return <Redirect to='/refresh' />;
    }

    return (
      <RenderIfLoaded isLoaded={this.state.loaded}>
        {() => (
          <Container>
            <Row className="d-flex p-2">
              <RoundedWrapper>
                <Logo />
                <RoundedContent>
                  {errorMessage}

                  <SelectRoleHeader>Select a role:</SelectRoleHeader>
                  <ListGroup>
                    {
                      roles.map(role =>
                        (
                          <Role
                            key={'role-item-' + role.index}
                            displayAccountId={this.displayAccountId}
                            index={role.index}
                            name={role.roleName}
                            accountId={role.accountId}
                            roleArn={role.roleArn}
                            principalArn={role.principalArn}
                          />
                        )
                      )
                    }
                  </ListGroup>
                </RoundedContent>
              </RoundedWrapper>
            </Row>
          </Container>
        )}
      </RenderIfLoaded>
    );
  }
}

const mapStateToProps = ({selectRole}) => ({
  ...selectRole.fetchFailure,
  ...selectRole.fetchSuccess,
  ...selectRole.submitFailure,
  ...selectRole.submitSuccess,
});

const mapDispatchToProps = (dispatch) => ({
  fetchSelectRole: bindActionCreators(fetchSelectRole, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ComponentWithError(SelectRole));
