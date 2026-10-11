# python-bot/test_sentinel.py
from grpc_server import evaluate_transaction_risk

def test_sentinel_safe_transaction():
    """Valida que una transacción con valores normales sea aprobada por la IA."""
    result = evaluate_transaction_risk(user_id=1, amount=1.0, price_usd=500.0, crypto_symbol="BTC")
    assert result["status"] == "APROBADO"
    assert result["risk_score"] < 40.0

def test_sentinel_high_risk_whale():
    """Valida que una transacción que supere los $50,000 active el bloqueo automático (AML)."""
    result = evaluate_transaction_risk(user_id=2, amount=1000.0, price_usd=60.0, crypto_symbol="BTC")
    assert result["status"] == "BLOQUEAR_AUTOMATICO"
    assert result["risk_score"] >= 70.0
    assert "MONTO_ELEVADO_SUPERIOR_A_50K" in result["flags"]

def test_sentinel_speculative_asset():
    """Valida que un activo altamente especulativo (PEPE) active las alertas del centinela."""
    result = evaluate_transaction_risk(user_id=3, amount=500000.0, price_usd=0.03, crypto_symbol="PEPE")
    assert result["status"] in ["BLOQUEAR_AUTOMATICO", "AUDITORIA_REQUERIDA"]
    assert "ALTA_VOLATILIDAD_ACTIVO_ESPECULATIVO" in result["flags"]