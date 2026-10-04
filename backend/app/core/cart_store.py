carts: dict[str, list[dict]] = {}


def get_cart(session_id: str) -> list[dict]:
    """
    Get the cart for a given session ID.

    :param session_id: The session ID of the user.
    :return: The list of products in the user's cart.
    """
    return carts.get(session_id, [])

def add_to_cart(session_id: str, product: dict) -> list[dict]:
    """
    Add a product to the cart for a given session ID.

    :param session_id: The session ID of the user.
    :param product: The product to add to the cart.
    :return: The updated list of products in the user's cart.
    """
    if session_id not in carts:
        carts[session_id] = []
    carts[session_id].append(product)
    return carts[session_id]

def remove_from_cart(session_id: str, index: int) -> list[dict]:
    """
    Remove a product from the cart for a given session ID.

    :param session_id: The session ID of the user.
    :param index: The index of the product to remove from the cart.
    :return: The updated list of products in the user's cart.
    """
    if session_id not in carts:
        return []
    if index < 0 or index >= len(carts[session_id]):
        return carts[session_id]  # ничего не делаем
    carts[session_id].pop(index)
    return carts[session_id]

def clear_cart(session_id: str) -> None:
    """
    Clear the cart for a given session ID.

    :param session_id: The session ID of the user.
    """
    if session_id in carts:
       carts[session_id] = []  # Clear the cart by setting it to an empty list