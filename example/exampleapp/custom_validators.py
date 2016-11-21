
def validate_user_id(api, params):
    if params.get('user_id') in ['001', '002', '003']:
        return True
    return False