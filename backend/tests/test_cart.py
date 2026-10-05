def test_get_empty_cart_api(client):
    response = client.get("/api/cart")
    assert response.status_code == 200
    assert response.json()["items"] == []
    assert response.json()["total"] == 0

def test_post_1_product_to_cart_api(client):
    body = {"product_id": 4}

    response = client.post("/api/cart", json = body)
    assert response.status_code == 201
    assert response.json()["items"][0]["id"] == 4
    assert len(response.json()["items"]) == 1

def test_unexisting_product_added_to_cart(client):
    body = {"product_id": 999}

    response = client.post("/api/cart", json = body)
    assert response.status_code == 404
    assert "not found" in response.json()["detail"] 

def test_deleting_one_product_from_cart(client):
    body = {"product_id": 1}
    client.post("/api/cart", json = body)
    client.post("/api/cart", json = body)
    response = client.delete("/api/cart/0")
    assert response.status_code == 200
    assert response.json()["items"][0]["id"] == 1
    assert len(response.json()["items"]) == 1

def test_deleting_out_of_range_product_from_cart(client):
    body = {"product_id": 1}
    client.post("/api/cart", json = body)
    client.post("/api/cart", json = body)
    response = client.delete("/api/cart/99")
    assert response.status_code == 404
    assert response.json()["detail"] == 'Index 99 out of range'

def test_clearing_whole_cart(client):
    body = {"product_id": 1}
    client.post("/api/cart", json = body)
    client.post("/api/cart", json = body)
    response = client.delete("/api/cart")
    assert response.status_code == 200
    assert response.json()["items"] == []
    assert response.json()["total"] == 0

def test_adding_3_indulgence_results_to_a_discount(client):
    body = {"product_id": 4}
    for _ in range(3):
        client.post("/api/cart", json = body)
    response = client.get("/api/cart")
    assert response.status_code == 200
    assert response.json()["discount"] == 0.1
    assert response.json()["total"] == 1350.0

def test_checkout_cart_item(client):
    body = {"product_id": 4}
    client.post("/api/cart", json = body)
    response = client.post("/api/cart/checkout")
    assert response.status_code == 200
    assert response.json()["order_id"] is not None
    assert response.json()["total"] > 0
    order_id = response.json()["order_id"]
    assert isinstance(order_id, str)
    assert len(order_id) > 0

    response_empty_cart = client.get("/api/cart")
    assert response_empty_cart.json()["items"] == []
    assert response_empty_cart.json()["total"] == 0

def test_checkout_empty_cart_returns_400(client):
    response = client.post("/api/cart/checkout")
    assert response.status_code == 400
    assert "empty" in response.json()["detail"].lower()

def test_session_id_is_in_cookies(client):
    body = {"product_id": 4}
    
    response = client.post("/api/cart", json = body)
    assert "session_id" in response.cookies
    assert response.cookies["session_id"]

def test_two_clients_are_independent(client):
    from fastapi.testclient import TestClient
    from app.main import app

    client_b = TestClient(app)

    client.post("/api/cart", json={"product_id": 4})
    client_b.post("/api/cart", json={"product_id": 2})

    cart_a = client.get("/api/cart").json()
    cart_b = client_b.get("/api/cart").json()

    assert len(cart_a["items"]) == 1
    assert cart_a["items"][0]["id"] == 4
    assert len(cart_b["items"]) == 1
    assert cart_b["items"][0]["id"] == 2







