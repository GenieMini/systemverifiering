import pytest
import unittest.mock as mock

import os

import pymongo
from dotenv import dotenv_values

from src.util.validators import getValidator

from src.util.dao import DAO

class DummyDAO(DAO):
    def __init__(self):
        pass

def test_dao_init():
    dao = DummyDAO()

    assert isinstance(dao, DAO)
