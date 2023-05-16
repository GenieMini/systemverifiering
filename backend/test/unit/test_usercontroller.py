import pytest
import unittest.mock as mock
from unittest.mock import patch
from src.controllers.usercontroller import UserController

TEST_DAO_USER = {
    "_id": {
        "$oid": "642ed61cb51d9278d7bf589a"
    },
    "email": "test@gmail.se",
    "firstName": "sharif",
    "lastName": "outagourte"
}

def test_raise_invalid_email():
    """
        Checks for a raise ValueError when an invalid email string
    """
    mocked_object = mock.MagicMock()
    mocked_object.find.return_value = [TEST_DAO_USER]
    controller = UserController(dao=mocked_object)

    invalid_email = "invalid"
    with pytest.raises(ValueError):
        controller.get_user_by_email(email=invalid_email)

def test_empty_string():
    """
        Raise error on empty string
    """
    mocked_object = mock.MagicMock()
    sut = UserController(dao=mocked_object)
    email = ''

    with pytest.raises(Exception):
        sut.get_user_by_email(email)

def test_no_input():
    """
        Raise error on no input
    """
    mocked_object = mock.MagicMock()
    sut = UserController(dao=mocked_object)

    with pytest.raises(Exception):
        sut.get_user_by_email()

def test_find_user():
    """
        Return correct  on correct input
    """
    mocked_object = mock.MagicMock()
    mocked_object.find.return_value = [TEST_DAO_USER]
    uc = UserController(dao=mocked_object)

    valid_email = "test@gmail.se"
    result = uc.get_user_by_email(email=valid_email)
    assert result == TEST_DAO_USER

def test_dont_find_user():
    """
        Raise error when email does not exist in dao
    """
    mocked_object = mock.MagicMock()

    dont_find_email = "dontfind@gmail.se"
    valid_email = "valid@gmail.se"
    mocked_object.find.return_value = [{'email': valid_email}]
    uc = UserController(dao=mocked_object)

    result = uc.get_user_by_email(email=dont_find_email)
    assert result == None

def test_nothing_in_dao():
    """
        Raise error in case DAO has nothing
    """
    mocked_object = mock.MagicMock()
    mocked_object.find.return_value = []
    uc = UserController(dao=mocked_object)

    valid_email = "test@gmail.se"
    result = uc.get_user_by_email(email=valid_email)
    assert result == None

@patch('builtins.print')
def test_duplicate_emails(mock_print):
    """
        Raise an exception incase there are duplicate emails
    """
    mocked_object = mock.MagicMock()
    email = TEST_DAO_USER["email"]
    mocked_object.find.return_value = [TEST_DAO_USER, TEST_DAO_USER]
    sut = UserController(dao=mocked_object)
    sut.get_user_by_email(email)

    mock_print.assert_called_with(f'Error: more than one user found with mail {email}')

def test_database_operation_fails():
    """
        Check if get_user_by_email raises an exception when database connection/operation fails.
    """
    mocked_object = mock.MagicMock()
    email = TEST_DAO_USER["email"]
    mocked_object.find.side_effect = Exception("Database operation failed")
    sut = UserController(dao=mocked_object)

    with pytest.raises(Exception):
        sut.get_user_by_email(email)