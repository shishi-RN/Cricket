const OBSWebSocket = require('obs-websocket-js').OBSWebSocket;

const obs = new OBSWebSocket();

(async () => {
  try {
    // Connect to OBS WebSocket server
    await obs.connect('ws://192.168.1.5:4455', '123456'); // Use your OBS WebSocket URL and password
    console.log('✅ Connected to OBS!');

    // Get the current scene
    const { currentProgramSceneName } = await obs.call('GetCurrentProgramScene');
    console.log(`🎬 Current scene: ${currentProgramSceneName}`);

    // Get all scene items
    const { sceneItems } = await obs.call('GetSceneItemList', {
      sceneName: currentProgramSceneName,
    });

    // Browser sources to control
    const browserSources = ['Browser 2', 'Browser 3', 'Browser 4'];

    // Map sources to their scene item IDs
    const browserItems = browserSources.map(sourceName => ({
      sourceName,
      item: sceneItems.find(item => item.sourceName === sourceName),
    }));

    // Fade transition function
    const fadeEffect = async (itemId, enabled) => {
      await obs.call('SetSceneItemBlendMode', {
        sceneName: currentProgramSceneName,
        sceneItemId: itemId,
        sceneItemBlendMode: 'OBS_BLEND_NORMAL',
      });

      await obs.call('SetSceneItemEnabled', {
        sceneName: currentProgramSceneName,
        sceneItemId: itemId,
        sceneItemEnabled: enabled,
      });
      console.log(`✨ ${enabled ? 'Enabled' : 'Disabled'} item with ID ${itemId}`);
    };

    // Function to randomly enable one browser and disable the others
    const switchBrowsers = async () => {
      const enabledIndex = Math.floor(Math.random() * browserItems.length);

      await Promise.all(
        browserItems.map(async ({ sourceName, item }, index) => {
          if (item) {
            const shouldEnable = index === enabledIndex;
            await fadeEffect(item.sceneItemId, shouldEnable);
            console.log(`🔄 ${shouldEnable ? 'Enabled' : 'Disabled'} "${sourceName}"`);
          } else {
            console.log(`⚠️ Source "${sourceName}" not found.`);
          }
        })
      );
    };

    console.log('🚀 Starting continuous random switching...');

    // Run the switching loop continuously every 2 seconds
    while (true) {
      await switchBrowsers();
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds delay
    }
  } catch (error) {
    console.error('❌ Failed to execute OBS command:', error);
  } finally {
    // Disconnect from OBS if the script stops
    await obs.disconnect();
    console.log('✅ Disconnected from OBS.');
  }
})();
