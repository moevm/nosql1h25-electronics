from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None and 'detail' in response.data:
        detail = response.data['detail']
        if isinstance(detail, (list, tuple)):
            detail_str = ' '.join(str(d) for d in detail)
        elif isinstance(detail, dict):
            first_key = next(iter(detail))
            messages = detail[first_key]
            if isinstance(messages, (list, tuple)):
                detail_str = f"{first_key} - {messages[0]}"
            else:
                detail_str = f"{first_key} - {messages}"
        else:
            detail_str = str(detail)
        response.data = {'details': detail_str}
    return response
