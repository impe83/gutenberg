/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { Modal } from '@wordpress/components';
import { Component, Fragment } from '@wordpress/element';
import { select } from '@wordpress/data';
import {
	PostPreviewButton,
} from '@wordpress/editor';
import './style.scss';
import { addQueryArgs } from '@wordpress/url';
import { getPostEditURL } from '../../../../edit-post/components/browser-url';

class PostLockedModal extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			isOpen: true,
		};

		this.takeOverPost = this.takeOverPost.bind( this );

		const user = select( 'core/editor' ).getPostLockUser();
		this.takeover = sprintf( __( '%s has taken over and is currently editing. Your latest changes were saved as a revision.' ), user.data.display_name );
		this.alreadyEditing = sprintf( __( '%s is already editing this post. Do you want to take over?' ), user.data.display_name );
	}

	takeOverPost() {
		const { getEditorSettings } = select( 'core/editor' );
		const { lockNonce } = getEditorSettings();
		const unlockUrl = addQueryArgs( getPostEditURL(), {
			'get-post-lock': '1',
			nonce: lockNonce,
			lockKey: true,
		} );
		document.location = unlockUrl;
	}

	goBack() {
		window.history.back();
	}

	render() {
		return (
			<Fragment>
				{
					this.state.isOpen ?
						<Modal
							title={ this.alreadyEditing }
							onRequestClose={ this.closeModal }
							focusOnMount={ true }
							shouldCloseOnClickOutside={ false }
							shouldCloseOnEsc={ false }
							showCloseIcon={ false }
							className="post-locked-modal"
						>

							<button
								className="button"
								onClick={ this.goBack }
							>
								Go back
							</button>
							<PostPreviewButton />
							<button
								className="button button-primary"
								onClick={ this.takeOver }
							>
								Take Over
							</button>
						</Modal> :
						null
				}
			</Fragment>
		);
	}
}

export default PostLockedModal;