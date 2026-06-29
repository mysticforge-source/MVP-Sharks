-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Reflect = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@flamework", "core", "out").Reflect
local Service = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@flamework", "core", "out").Service
local createCollection = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "lapis", "out").createCollection
local Players = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").Players
local PlayerData = TS.import(script, game:GetService("ServerScriptService"), "TS", "network", "server").PlayerData
local t = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "t", "lib", "ts").t
local serverMaid = TS.import(script, game:GetService("ServerScriptService"), "TS", "servermaid").serverMaid
local World = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "ecs", "world").World
local UserDataComponent = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "ecs", "components").UserDataComponent
local defaultUserData = {
	coins = 0,
}
local validateUserData = t.interface({
	coins = t.numberConstrained(0, 200),
})
-- player --> entity map
local PlayerToEntity = {}
-- entity --> player map
local EntityToPlayer = {}
local DataService
do
	DataService = setmetatable({}, {
		__tostring = function()
			return "DataService"
		end,
	})
	DataService.__index = DataService
	function DataService.new(...)
		local self = setmetatable({}, DataService)
		return self:constructor(...) or self
	end
	function DataService:constructor()
		self.Collection = createCollection("PROD_PlayerData", {
			defaultData = defaultUserData,
			validate = validateUserData,
		})
		self.Sessions = {}
		self.maid = serverMaid:sub()
	end
	DataService.PlayerLoaded = TS.async(function(self, player, ses)
		-- player entity
		local entity = World:entity()
		local _player = player
		PlayerToEntity[_player] = entity
		local _player_1 = player
		EntityToPlayer[entity] = _player_1
		-- sets component to session data (validated by Lapis via validateUserData)
		local data = ses:read()
		World:set(entity, UserDataComponent, data)
		-- send to client
		PlayerData.fire(player, data)
	end)
	DataService.PlayerUnloaded = TS.async(function(self, player, ses)
		local _player = player
		local entity = PlayerToEntity[_player]
		if entity ~= 0 and entity == entity and entity then
			local _player_1 = player
			PlayerToEntity[_player_1] = nil
			EntityToPlayer[entity] = nil
		end
	end)
	DataService.PlayerAdded = TS.async(function(self, player)
		local _exp = self.Collection:load(`User{player.UserId}`, { player.UserId })
		local _arg0 = TS.async(function(ses)
			if not player.Parent then
				ses:close():catch(warn)
				return nil
			end
			local _sessions = self.Sessions
			local _player = player
			local _ses = ses
			_sessions[_player] = _ses
			TS.await(self:PlayerLoaded(player, ses))
		end)
		_exp:andThen(_arg0):catch(TS.async(function(err)
			player:Kick(`Failed to load data: {tostring(err)}`)
		end))
	end)
	DataService.PlayerRemoving = TS.async(function(self, player)
		local _sessions = self.Sessions
		local _player = player
		local ses = _sessions[_player]
		if ses then
			local _exp = ses:close()
			local _arg0 = TS.async(function()
				TS.await(self:PlayerUnloaded(player, ses))
				local _sessions_1 = self.Sessions
				local _player_1 = player
				_sessions_1[_player_1] = nil
			end)
			_exp:andThen(_arg0):catch(TS.async(function(err)
				return warn(`Failed to remove player session data: {tostring(err)}`)
			end))
		end
	end)
	function DataService:onStart()
		self.maid:on(Players.PlayerAdded, TS.async(function(Player)
			return TS.await(self:PlayerAdded(Player))
		end))
		self.maid:on(Players.PlayerRemoving, TS.async(function(Player)
			return TS.await(self:PlayerRemoving(Player))
		end))
		for _, plr in Players:GetPlayers() do
			self:PlayerAdded(plr)
		end
		-- Connects to changes of player entities, updates session and calls sync event with the player
		self.maid:Add(World:changed(UserDataComponent, function(entity, id, value)
			local _entity = entity
			local player = EntityToPlayer[_entity]
			if not player then
				warn("Change occured within data of a player not stored in EntityToPlayer maps")
				return nil
			end
			local ses = self.Sessions[player]
			if not ses then
				warn("Change occured within data of a player without a stored session!")
				return nil
			end
			ses:write(value)
			PlayerData.fire(player, value)
		end))
	end
	do
		-- (Flamework) DataService metadata
		Reflect.defineMetadata(DataService, "identifier", "server/services/dataservice@DataService")
		Reflect.defineMetadata(DataService, "flamework:implements", { "$:flamework@OnStart" })
	end
end
-- (Flamework) DataService decorators
Reflect.decorate(DataService, "$:flamework@Service", Service, {})
return {
	defaultUserData = defaultUserData,
	validateUserData = validateUserData,
	PlayerToEntity = PlayerToEntity,
	EntityToPlayer = EntityToPlayer,
	DataService = DataService,
}
