interface Workspace extends Model {
	Shared: Folder & {
		Hitboxes: Folder;
	};
	Client: Folder & {
		Models: Folder;
	};
}

interface ReplicatedStorage extends Instance {
	Hitboxes: Folder & {
		["Reef Shark Medium"]: MeshPart & {
			ViewAttachment: Attachment;
		};
	};
	Models: Folder & {
		["Reef Shark Medium"]: Model & {
			AnimationController: AnimationController & {
				Animator: Animator;
			};
			Body_low: MeshPart & {
				SurfaceAppearance: SurfaceAppearance;
				Body_lowMotor6D: Motor6D;
			};
			Eye_low: MeshPart & {
				SurfaceAppearance: SurfaceAppearance;
				Eye_lowMotor6D: Motor6D;
			};
			AnimSaves: ObjectValue;
			Teeth_low: MeshPart & {
				SurfaceAppearance: SurfaceAppearance;
				Teeth_lowMotor6D: Motor6D;
			};
			RootPart: Part & {
				["spine.003"]: Bone & {
					["spine.002"]: Bone & {
						["spine.001"]: Bone & {
							["mid_fin.Top"]: Bone;
							spine: Bone & {
								["back_fin.T.Bk"]: Bone & {
									["back_fin.T.001.Bk"]: Bone & {
										["back_fin.T.002.Bk"]: Bone;
									};
								};
								["back_fin.B.Bk"]: Bone & {
									["back_fin.B.001.Bk"]: Bone;
								};
							};
							["mid_fin.Bot"]: Bone;
						};
					};
					["spine.008"]: Bone & {
						["chest_fin.Bot.R"]: Bone;
						["chest_fin.Bot.L"]: Bone;
						["spine.004"]: Bone & {
							top_fin: Bone & {
								["top_fin.001"]: Bone;
							};
							["spine.005"]: Bone & {
								["spine.006"]: Bone & {
									["spine.007"]: Bone & {
										["eye.R"]: Bone;
										["jaw.master"]: Bone & {
											["jaw.002.R"]: Bone & {
												["jaw.003.R"]: Bone;
											};
											["jaw.002.L"]: Bone & {
												["jaw.003.L"]: Bone;
											};
											jaw: Bone & {
												["jaw.001"]: Bone;
											};
										};
										["eye.L"]: Bone;
									};
								};
								["shoulder.L"]: Bone & {
									["side_fin.L"]: Bone & {
										["side_fin.L.001"]: Bone;
									};
								};
								["shoulder.R"]: Bone & {
									["side_fin.R"]: Bone & {
										["side_fin.R.001"]: Bone;
									};
								};
							};
						};
					};
				};
			};
			InitialPoses: Folder & {
				["back_fin.T.002.Bk_Original"]: CFrameValue;
				["back_fin.B.Bk_Initial"]: CFrameValue;
				["spine.006_Original"]: CFrameValue;
				spine_Initial: CFrameValue;
				Teeth_low_Composited: CFrameValue;
				["back_fin.T.001.Bk_Original"]: CFrameValue;
				["spine.003_Original"]: CFrameValue;
				["side_fin.R.001_end_Composited"]: CFrameValue;
				["spine.001_Composited"]: CFrameValue;
				["back_fin.B.001.Bk_Original"]: CFrameValue;
				["spine.004_Original"]: CFrameValue;
				["jaw.001_end_Composited"]: CFrameValue;
				["back_fin.B.001.Bk_Composited"]: CFrameValue;
				["spine.001_Initial"]: CFrameValue;
				["eye.R_end_Original"]: CFrameValue;
				["side_fin.L.001_Composited"]: CFrameValue;
				["back_fin.B.001.Bk_end_Initial"]: CFrameValue;
				["back_fin.T.002.Bk_Composited"]: CFrameValue;
				["chest_fin.Bot.R_Initial"]: CFrameValue;
				["side_fin.R.001_Composited"]: CFrameValue;
				["jaw.003.R_end_Original"]: CFrameValue;
				["side_fin.L_Composited"]: CFrameValue;
				Eye_low_Composited: CFrameValue;
				["chest_fin.Bot.L_end_Initial"]: CFrameValue;
				["side_fin.L_Original"]: CFrameValue;
				["mid_fin.Top_Initial"]: CFrameValue;
				["jaw.master_Initial"]: CFrameValue;
				["mid_fin.Bot_end_Initial"]: CFrameValue;
				["spine.001_Original"]: CFrameValue;
				["jaw.001_Original"]: CFrameValue;
				["mid_fin.Top_end_Initial"]: CFrameValue;
				["shoulder.L_Initial"]: CFrameValue;
				["jaw.003.L_end_Composited"]: CFrameValue;
				["spine.008_Composited"]: CFrameValue;
				["spine.008_Original"]: CFrameValue;
				Teeth_low_Original: CFrameValue;
				["chest_fin.Bot.R_end_Initial"]: CFrameValue;
				top_fin_Original: CFrameValue;
				["eye.L_Original"]: CFrameValue;
				["spine.008_Initial"]: CFrameValue;
				["side_fin.L.001_end_Composited"]: CFrameValue;
				["mid_fin.Bot_end_Composited"]: CFrameValue;
				["spine.004_Composited"]: CFrameValue;
				["spine.006_Composited"]: CFrameValue;
				["jaw.003.L_Composited"]: CFrameValue;
				["side_fin.L.001_end_Original"]: CFrameValue;
				["eye.L_end_Original"]: CFrameValue;
				["chest_fin.Bot.L_Original"]: CFrameValue;
				["jaw.003.L_Initial"]: CFrameValue;
				["shoulder.R_Original"]: CFrameValue;
				["back_fin.T.002.Bk_end_Composited"]: CFrameValue;
				["mid_fin.Bot_Composited"]: CFrameValue;
				["chest_fin.Bot.R_Original"]: CFrameValue;
				["top_fin.001_Composited"]: CFrameValue;
				spine_Original: CFrameValue;
				["back_fin.B.001.Bk_Initial"]: CFrameValue;
				["spine.005_Composited"]: CFrameValue;
				["spine.007_Composited"]: CFrameValue;
				["side_fin.L.001_end_Initial"]: CFrameValue;
				["jaw.002.R_Composited"]: CFrameValue;
				top_fin_Initial: CFrameValue;
				["back_fin.T.Bk_Original"]: CFrameValue;
				["chest_fin.Bot.L_Composited"]: CFrameValue;
				["spine.007_Original"]: CFrameValue;
				["back_fin.B.001.Bk_end_Original"]: CFrameValue;
				["eye.R_end_Composited"]: CFrameValue;
				["jaw.master_Composited"]: CFrameValue;
				["jaw.002.L_Original"]: CFrameValue;
				["eye.L_end_Initial"]: CFrameValue;
				["top_fin.001_Initial"]: CFrameValue;
				["chest_fin.Bot.R_end_Composited"]: CFrameValue;
				["top_fin.001_end_Composited"]: CFrameValue;
				["jaw.002.L_Initial"]: CFrameValue;
				["eye.R_end_Initial"]: CFrameValue;
				["back_fin.T.Bk_Initial"]: CFrameValue;
				["side_fin.L.001_Original"]: CFrameValue;
				["back_fin.B.001.Bk_end_Composited"]: CFrameValue;
				["top_fin.001_Original"]: CFrameValue;
				["side_fin.L_Initial"]: CFrameValue;
				["side_fin.R.001_end_Initial"]: CFrameValue;
				["side_fin.L.001_Initial"]: CFrameValue;
				["jaw.003.L_end_Original"]: CFrameValue;
				["eye.L_Composited"]: CFrameValue;
				spine_Composited: CFrameValue;
				["side_fin.R.001_Initial"]: CFrameValue;
				Eye_low_Original: CFrameValue;
				["mid_fin.Top_end_Original"]: CFrameValue;
				["back_fin.B.Bk_Composited"]: CFrameValue;
				["spine.003_Composited"]: CFrameValue;
				["jaw.003.R_end_Composited"]: CFrameValue;
				["top_fin.001_end_Initial"]: CFrameValue;
				["jaw.003.R_Original"]: CFrameValue;
				["chest_fin.Bot.R_Composited"]: CFrameValue;
				["jaw.002.R_Original"]: CFrameValue;
				Body_low_Composited: CFrameValue;
				jaw_Original: CFrameValue;
				["spine.005_Original"]: CFrameValue;
				Body_low_Initial: CFrameValue;
				["side_fin.R.001_Original"]: CFrameValue;
				["jaw.003.R_Initial"]: CFrameValue;
				["spine.003_Initial"]: CFrameValue;
				["jaw.002.R_Initial"]: CFrameValue;
				["side_fin.R_Composited"]: CFrameValue;
				["mid_fin.Bot_Original"]: CFrameValue;
				["back_fin.T.Bk_Composited"]: CFrameValue;
				["mid_fin.Bot_Initial"]: CFrameValue;
				["shoulder.R_Initial"]: CFrameValue;
				["jaw.003.R_Composited"]: CFrameValue;
				["jaw.master_Original"]: CFrameValue;
				["jaw.003.L_Original"]: CFrameValue;
				["back_fin.T.001.Bk_Composited"]: CFrameValue;
				Body_low_Original: CFrameValue;
				["eye.R_Composited"]: CFrameValue;
				["side_fin.R_Initial"]: CFrameValue;
				["jaw.002.L_Composited"]: CFrameValue;
				["shoulder.R_Composited"]: CFrameValue;
				["spine.002_Initial"]: CFrameValue;
				["spine.005_Initial"]: CFrameValue;
				["side_fin.R_Original"]: CFrameValue;
				["chest_fin.Bot.L_end_Composited"]: CFrameValue;
				["back_fin.T.002.Bk_end_Original"]: CFrameValue;
				["spine.006_Initial"]: CFrameValue;
				["shoulder.L_Original"]: CFrameValue;
				["shoulder.L_Composited"]: CFrameValue;
				["jaw.001_Composited"]: CFrameValue;
				["side_fin.R.001_end_Original"]: CFrameValue;
				metarig_Initial: CFrameValue;
				["top_fin.001_end_Original"]: CFrameValue;
				["mid_fin.Bot_end_Original"]: CFrameValue;
				metarig_Composited: CFrameValue;
				top_fin_Composited: CFrameValue;
				["eye.L_Initial"]: CFrameValue;
				["jaw.001_Initial"]: CFrameValue;
				["mid_fin.Top_Composited"]: CFrameValue;
				["mid_fin.Top_Original"]: CFrameValue;
				["mid_fin.Top_end_Composited"]: CFrameValue;
				["spine.007_Initial"]: CFrameValue;
				["back_fin.T.002.Bk_end_Initial"]: CFrameValue;
				jaw_Composited: CFrameValue;
				["back_fin.T.001.Bk_Initial"]: CFrameValue;
				["jaw.001_end_Original"]: CFrameValue;
				metarig_Original: CFrameValue;
				["spine.004_Initial"]: CFrameValue;
				["chest_fin.Bot.L_Initial"]: CFrameValue;
				["eye.L_end_Composited"]: CFrameValue;
				Teeth_low_Initial: CFrameValue;
				["chest_fin.Bot.R_end_Original"]: CFrameValue;
				["back_fin.T.002.Bk_Initial"]: CFrameValue;
				jaw_Initial: CFrameValue;
				["chest_fin.Bot.L_end_Original"]: CFrameValue;
				["jaw.001_end_Initial"]: CFrameValue;
				["eye.R_Original"]: CFrameValue;
				["spine.002_Composited"]: CFrameValue;
				Eye_low_Initial: CFrameValue;
				["jaw.003.L_end_Initial"]: CFrameValue;
				["spine.002_Original"]: CFrameValue;
				["eye.R_Initial"]: CFrameValue;
				["back_fin.B.Bk_Original"]: CFrameValue;
				["jaw.003.R_end_Initial"]: CFrameValue;
			};
		};
	};
}
