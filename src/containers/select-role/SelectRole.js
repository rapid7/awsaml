import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Container,
  ListGroup,
  Row,
} from 'reactstrap';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { fetchSelectRole } from '../../actions/select-role';
import ComponentWithError from '../components/ComponentWithError';
import RenderIfLoaded from '../components/RenderIfLoaded';
import Role from './Role';
import Logo from '../components/Logo';
import {
  RoundedContent,
  RoundedWrapper,
} from '../../constants/styles';

const SelectRoleHeader = styled.h4`
  margin-top: 15px;
  padding-top: 15px;
`;

class SelectRole extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      displayAccountId: true,
    };
  }

  async componentDidMount() {
    const {
      fetchSelectRole: fsr,
    } = this.props;

    this._isMounted = true; // eslint-disable-line no-underscore-dangle

    await fsr();
    if (this._isMounted) { // eslint-disable-line no-underscore-dangle
      this.setState({
        loaded: true,
      });

      const {
        roles,
      } = this.props;

      const uniqueAccountIds = new Set(
        roles.map((role) => role.accountId),
      );

      if (uniqueAccountIds.size === 1) {
        this.setState({
          displayAccountId: false,
        });
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false; // eslint-disable-line no-underscore-dangle
  }

  render() {
    const {
      errorMessage,
      status,
      roles,
    } = this.props;

    if (status === 'selected') {
      return <Redirect to="/refresh" />;
    }

    const {
      loaded,
      displayAccountId,
    } = this.state;

    return (
      <RenderIfLoaded isLoaded={loaded}>
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
                      roles.map((role) => (
                        <Role
                          accountId={role.accountId}
                          displayAccountId={displayAccountId}
                          index={role.index}
                          key={`role-item-${role.index}`}
                          name={role.roleName}
                          principalArn={role.principalArn}
                          roleArn={role.roleArn}
                        />
                      ))
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

SelectRole.propTypes = {
  errorMessage: PropTypes.string,
  fetchSelectRole: PropTypes.func,
  roles: PropTypes.arrayOf(PropTypes.shape({
    accountId: PropTypes.string,
    index: PropTypes.number,
    roleName: PropTypes.string,
    principalArn: PropTypes.string,
    roleArn: PropTypes.string,
  })),
  status: PropTypes.string,
};

const mapStateToProps = ({ selectRole }) => ({
  ...selectRole.fetchFailure,
  ...selectRole.fetchSuccess,
  ...selectRole.submitFailure,
  ...selectRole.submitSuccess,
});

const mapDispatchToProps = (dispatch) => ({
  fetchSelectRole: bindActionCreators(fetchSelectRole, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ComponentWithError(SelectRole));
