# Reproducible practice receipt

`confirmed-noaa-review.receipt.json` is the earlier public NOAA browser integration fixture. Its upgraded proof was checked in the production interface on 24 October 2026 at about 10:26 UTC against Bitcoin block **972,903**, with **7 confirmations** reported by Blockstream at that moment. It has a self-declared automated test reviewer label. This is evidence that the software flow worked, not a sensor-accuracy or reviewer-identity certificate. Its digest is `da0dc1cbf959e73af19063dbda43cf36d2341d71e26ba4b2d62395171ac74cec`.

`practice-review.receipt.json` was exported from the live Tideprint interface during release QA on 24 October 2026. It contains 241 original rows from the explicitly changed NOAA practice copy, six keep decisions with QA reasons, the seal, and a real pending OpenTimestamps proof. This is a software integration fixture, not a field review or an accuracy judgement.

Open **Verify a receipt** in https://tideprint.vercel.app, then choose this JSON file or paste its contents. Integrity checks should pass. Change the injected `4.8` value in `rawCSV` to `4.9`, retaining the original hashes, and verification should report an original-data mismatch. Restore the unedited fixture before checking the optional proof.

Receipt digest: `458fb44288700a1ef4c19c3a8612db6a3948080b3525f9593e5ad545a7136723`.

The attached calendar promise is not a confirmed Bitcoin timestamp. Use **Check / update Bitcoin proof** to request an upgrade. Network or calendar failure must retain the existing proof and must never be reported as confirmation. To use another verifier, export **Manifest JSON** and its matching **.ots proof** from the receipt view. The timestamp binds that manifest, not the raw CSV alone.
