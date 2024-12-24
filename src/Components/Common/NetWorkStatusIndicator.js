import { useEffect } from "react";
import { useNetwork } from "../../Context/network.context.js";

const NetworkStatusIndicator = () => {
  const { isConnected, isInternetSlow, showAlert } = useNetwork();

  useEffect(() => {
    if (!isConnected) {
      showAlert("No Internet", "Please check your connection.");
    } else if (isInternetSlow) {
      showAlert("Slow Internet", "Your internet speed is slow. Some features may not work properly.");
    };
  }, [isConnected, isInternetSlow]);

  return null;
};

export default NetworkStatusIndicator;
